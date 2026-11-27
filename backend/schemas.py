
from pydantic import BaseModel, Field, ConfigDict, field_validator
from decimal import Decimal
import re


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=150)
    password: str = Field(..., min_length=8, max_length=100)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        value = value.strip().lower()
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
            raise ValueError("Invalid email address")
        return value


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class GroupCreate(BaseModel):
    group_name: str = Field(..., min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    created_by: int = Field(..., gt=0)


class GroupResponse(BaseModel):
    group_id: int
    group_name: str
    description: str | None
    created_by: int

    model_config = ConfigDict(from_attributes=True)


class MemberAdd(BaseModel):
    user_id: int = Field(..., gt=0)


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    amount: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
    paid_by: int = Field(..., gt=0)
    splits: dict[int, Decimal]


class ExpenseResponse(BaseModel):
    expense_id: int
    group_id: int
    title: str
    amount: Decimal
    paid_by: int

    model_config = ConfigDict(from_attributes=True)


class SplitResponse(BaseModel):
    split_id: int
    expense_id: int
    user_id: int
    amount: Decimal

    model_config = ConfigDict(from_attributes=True)
