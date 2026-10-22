from app.core.config import settings
from app.core.exceptions import (
    ChildWithoutAdultError,
    EmptyOrderError,
    InvalidParticipantError,
)
from app.schemas.order import Participant, PriceBreakdown


def classify(age: int) -> str:
    """Возвращает 'adult' или 'child'."""
    return "adult" if age >= settings.ADULT_MIN_AGE else "child"


def validate_participants(participants: list[Participant]) -> None:
    if not participants:
        raise EmptyOrderError()

    adults = sum(1 for p in participants if classify(p.age) == "adult")
    children = sum(1 for p in participants if classify(p.age) == "child")

    if children > 0 and adults == 0:
        raise ChildWithoutAdultError()

    # Дополнительное правило: на каждого взрослого не более 3 детей
    if adults > 0 and children > adults * 3:
        raise InvalidParticipantError(
            "На одного взрослого допускается не более 3 детей"
        )


def calculate(participants: list[Participant]) -> PriceBreakdown:
    validate_participants(participants)

    adults = sum(1 for p in participants if classify(p.age) == "adult")
    children = len(participants) - adults

    adult_total = adults * settings.ADULT_PRICE
    child_total = children * settings.CHILD_PRICE

    return PriceBreakdown(
        adults=adults,
        children=children,
        adult_price=settings.ADULT_PRICE,
        child_price=settings.CHILD_PRICE,
        adult_total=adult_total,
        child_total=child_total,
        total=adult_total + child_total,
    )
