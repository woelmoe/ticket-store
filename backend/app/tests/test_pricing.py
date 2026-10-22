import pytest
from app.core.exceptions import (
    ChildWithoutAdultError,
    EmptyOrderError,
    InvalidParticipantError,
)
from app.schemas.order import Participant
from app.services import pricing


def P(name, age):
    return Participant(name=name, age=age)


def test_adult_only():
    result = pricing.calculate([P("A", 30), P("B", 25)])
    assert result.adults == 2
    assert result.children == 0
    assert result.total == 3000.0


def test_child_with_adult():
    result = pricing.calculate([P("A", 30), P("C", 8)])
    assert result.adults == 1
    assert result.children == 1
    assert result.total == 1500.0 + 750.0


def test_child_without_adult_raises():
    with pytest.raises(ChildWithoutAdultError):
        pricing.calculate([P("C1", 10), P("C2", 12)])


def test_empty_raises():
    with pytest.raises(EmptyOrderError):
        pricing.calculate([])


def test_too_many_children_per_adult():
    participants = [P("A", 30)] + [P(f"C{i}", 10) for i in range(4)]
    with pytest.raises(InvalidParticipantError):
        pricing.calculate(participants)


def test_boundary_age_18_is_adult():
    result = pricing.calculate([P("A", 18)])
    assert result.adults == 1


def test_boundary_age_17_is_child_requires_adult():
    with pytest.raises(ChildWithoutAdultError):
        pricing.calculate([P("C", 17)])
