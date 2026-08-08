class InvalidTransitionError(ValueError):
    """Raised when a requested status transition isn't legal from the current state."""

    def __init__(self, from_status: str, to_status: str):
        super().__init__(f"Cannot transition from '{from_status}' to '{to_status}'.")
        self.from_status = from_status
        self.to_status = to_status
