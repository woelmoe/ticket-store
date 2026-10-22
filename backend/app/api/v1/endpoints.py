from fastapi import APIRouter

from app.schemas.order import (
    CalculateResponse,
    OrderCreate,
    OrderResponse,
)
from app.services import inventory, pricing

router = APIRouter(prefix="/api/v1", tags=["tickets"])


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/seats")
def seats():
    return {"seats_left": inventory.get_seats_left()}


@router.post("/calculate", response_model=CalculateResponse)
def calculate_price(payload: OrderCreate):
    breakdown = pricing.calculate(payload.participants)
    return CalculateResponse(breakdown=breakdown, total=breakdown.total)


@router.post("/order", response_model=OrderResponse)
async def create_order(payload: OrderCreate):
    breakdown = pricing.calculate(payload.participants)
    order_id = await inventory.reserve(payload.participants)

    return OrderResponse(
        order_id=order_id,
        email=str(payload.email),
        participants=payload.participants,
        breakdown=breakdown,
        total=breakdown.total,
        seats_left=inventory.get_seats_left(),
    )
