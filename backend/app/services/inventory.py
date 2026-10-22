import asyncio
import uuid

from app.core.config import settings
from app.core.exceptions import SoldOutError

# ─── In-memory мок-хранилище ───
_seats_left: int = settings.TOTAL_CAPACITY
_orders: dict[str, list[dict]] = {}
_lock = asyncio.Lock()


def get_seats_left() -> int:
    return _seats_left


async def reserve(participants: list) -> str:
    """Атомарно бронирует места и создаёт заказ."""
    global _seats_left
    count = len(participants)

    async with _lock:
        if count > _seats_left:
            raise SoldOutError(requested=count, available=_seats_left)
        _seats_left -= count
        order_id = uuid.uuid4().hex[:12]
        _orders[order_id] = [p.model_dump() for p in participants]
        return order_id


def get_order(order_id: str) -> list[dict] | None:
    return _orders.get(order_id)


def reset() -> None:
    """Для тестов: вернуть состояние к исходному."""
    global _seats_left
    _seats_left = settings.TOTAL_CAPACITY
    _orders.clear()
