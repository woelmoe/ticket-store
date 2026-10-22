class DomainError(Exception):
    """Базовое доменное исключение."""

    status_code = 400
    code = "DOMAIN_ERROR"

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class SoldOutError(DomainError):
    status_code = 409
    code = "SOLD_OUT"

    def __init__(self, requested: int, available: int):
        super().__init__(
            f"Недостаточно мест: запрошено {requested}, доступно {available}"
        )
        self.requested = requested
        self.available = available


class ChildWithoutAdultError(DomainError):
    status_code = 422
    code = "CHILD_WITHOUT_ADULT"

    def __init__(self):
        super().__init__("Ребёнок не может быть без сопровождающего взрослого")


class InvalidParticipantError(DomainError):
    status_code = 422
    code = "INVALID_PARTICIPANT"

    def __init__(self, message: str):
        super().__init__(message)


class EmptyOrderError(DomainError):
    status_code = 422
    code = "EMPTY_ORDER"

    def __init__(self):
        super().__init__("Заказ не может быть пустым")
