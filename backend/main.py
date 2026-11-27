
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pwdlib import PasswordHash

from database import engine, get_db
from models import (
    Base,
    User,
    ExpenseGroup,
    GroupMember,
    Expense,
    ExpenseSplit
)
from schemas import (
    UserCreate,
    UserResponse,
    GroupCreate,
    GroupResponse,
    MemberAdd,
    ExpenseCreate,
    ExpenseResponse
)

app = FastAPI(
    
    title="SWYNEX API",
    description="AI-Powered Receipt-Based Expense Splitting Application",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

password_hash = PasswordHash.recommended()


# ---------------- HOME API ----------------

@app.get("/")
def home():
    return {"message": "SWYNEX API is running"}


# ---------------- USER APIs ----------------

@app.post("/api/users/register", response_model=UserResponse, status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )


@app.get("/api/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ---------------- GROUP APIs ----------------

@app.post("/api/groups", response_model=GroupResponse, status_code=201)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):

    creator = db.query(User).filter(
        User.user_id == group.created_by
    ).first()

    if not creator:
        raise HTTPException(
            status_code=404,
            detail="Creator not found"
        )

    new_group = ExpenseGroup(
        group_name=group.group_name,
        description=group.description,
        created_by=group.created_by
    )

    db.add(new_group)
    db.flush()

    creator_membership = GroupMember(
        group_id=new_group.group_id,
        user_id=group.created_by
    )

    db.add(creator_membership)
    db.commit()
    db.refresh(new_group)

    return new_group


@app.get("/api/groups", response_model=list[GroupResponse])
def get_groups(db: Session = Depends(get_db)):
    return db.query(ExpenseGroup).all()


# ---------------- GROUP MEMBER APIs ----------------

@app.post("/api/groups/{group_id}/members", status_code=201)
def add_member(
    group_id: int,
    member: MemberAdd,
    db: Session = Depends(get_db)
):

    group = db.query(ExpenseGroup).filter(
        ExpenseGroup.group_id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    user = db.query(User).filter(
        User.user_id == member.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == member.user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="User is already a member"
        )

    new_member = GroupMember(
        group_id=group_id,
        user_id=member.user_id
    )

    db.add(new_member)
    db.commit()

    return {"message": "Member added successfully"}


@app.get("/api/groups/{group_id}/members", response_model=list[UserResponse])
def get_group_members(
    group_id: int,
    db: Session = Depends(get_db)
):

    group = db.query(ExpenseGroup).filter(
        ExpenseGroup.group_id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    return (
        db.query(User)
        .join(GroupMember, User.user_id == GroupMember.user_id)
        .filter(GroupMember.group_id == group_id)
        .all()
    )


# ---------------- EXPENSE APIs ----------------

@app.post(
    "/api/groups/{group_id}/expenses",
    response_model=ExpenseResponse,
    status_code=201
)
def add_expense(
    group_id: int,
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):

    group = db.query(ExpenseGroup).filter(
        ExpenseGroup.group_id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    member_ids = {
        member.user_id
        for member in db.query(GroupMember).filter(
            GroupMember.group_id == group_id
        ).all()
    }

    if expense.paid_by not in member_ids:
        raise HTTPException(
            status_code=400,
            detail="Payer must be a member of this group"
        )

    if not expense.splits:
        raise HTTPException(
            status_code=400,
            detail="At least one split is required"
        )

    if any(amount <= 0 for amount in expense.splits.values()):
        raise HTTPException(
            status_code=400,
            detail="Split amounts must be greater than zero"
        )

    if not set(expense.splits.keys()).issubset(member_ids):
        raise HTTPException(
            status_code=400,
            detail="All split users must be group members"
        )

    total_split = sum(
        expense.splits.values(),
        Decimal("0.00")
    )

    if total_split != expense.amount:
        raise HTTPException(
            status_code=400,
            detail="The sum of splits must equal the expense amount"
        )

    new_expense = Expense(
        group_id=group_id,
        title=expense.title,
        amount=expense.amount,
        paid_by=expense.paid_by
    )

    db.add(new_expense)
    db.flush()

    for user_id, share in expense.splits.items():
        split = ExpenseSplit(
            expense_id=new_expense.expense_id,
            user_id=user_id,
            amount=share
        )
        db.add(split)

    db.commit()
    db.refresh(new_expense)

    return new_expense


@app.get(
    "/api/groups/{group_id}/expenses",
    response_model=list[ExpenseResponse]
)
def get_group_expenses(
    group_id: int,
    db: Session = Depends(get_db)
):

    group = db.query(ExpenseGroup).filter(
        ExpenseGroup.group_id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    return db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()


# ---------------- BALANCE API ----------------

@app.get("/api/groups/{group_id}/balances")
def get_group_balances(
    group_id: int,
    db: Session = Depends(get_db)
):

    group = db.query(ExpenseGroup).filter(
        ExpenseGroup.group_id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    members = db.query(User).join(
        GroupMember,
        User.user_id == GroupMember.user_id
    ).filter(
        GroupMember.group_id == group_id
    ).all()

    balances = {
        member.user_id: {
            "user_id": member.user_id,
            "name": member.name,
            "paid": Decimal("0.00"),
            "share": Decimal("0.00")
        }
        for member in members
    }

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    for expense in expenses:

        balances[expense.paid_by]["paid"] += expense.amount

        splits = db.query(ExpenseSplit).filter(
            ExpenseSplit.expense_id == expense.expense_id
        ).all()

        for split in splits:
            balances[split.user_id]["share"] += split.amount

    result = []

    for balance in balances.values():
        balance["balance"] = balance["paid"] - balance["share"]
        result.append(balance)

    return result
  