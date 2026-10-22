from pydantic import BaseModel, EmailStr, Field, field_validator


class Participant(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=120)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Имя не может быть пустым")
        return v.strip()


class OrderCreate(BaseModel):
    email: EmailStr
    participants: list[Participant] = Field(..., min_length=1, max_length=20)


class PriceBreakdown(BaseModel):
    adults: int
    children: int
    adult_price: float
    child_price: float
    adult_total: float
    child_total: float
    total: float


class OrderResponse(BaseModel):
    order_id: str
    email: str
    participants: list[Participant]
    breakdown: PriceBreakdown
    total: float
    seats_left: int


class CalculateResponse(BaseModel):
    breakdown: PriceBreakdown
    total: float
