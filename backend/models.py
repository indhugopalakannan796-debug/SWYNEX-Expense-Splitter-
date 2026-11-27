
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey,
    Numeric, UniqueConstraint, CheckConstraint
)
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExpenseGroup(Base):
    __tablename__ = "expense_groups"

    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GroupMember(Base):
    __tablename__ = "group_members"

    __table_args__ = (
        UniqueConstraint("group_id", "user_id"),
    )

    membership_id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("expense_groups.group_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())


class Expense(Base):
    __tablename__ = "expenses"

    __table_args__ = (
        CheckConstraint("amount > 0", name="check_expense_amount"),
    )

    expense_id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("expense_groups.group_id"), nullable=False)
    title = Column(String(150), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    paid_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    __table_args__ = (
        UniqueConstraint("expense_id", "user_id"),
        CheckConstraint("amount >= 0", name="check_split_amount"),
    )

    split_id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.expense_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
