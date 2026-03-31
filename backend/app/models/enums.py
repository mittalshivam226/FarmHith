import enum


class UserRole(str, enum.Enum):
    FARMER = "farmer"
    LAB = "lab"
    BUYER = "buyer"
    ADMIN = "admin"


class SoilRequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    SAMPLE_COLLECTED = "sample_collected"
    REPORT_READY = "report_ready"
    COMPLETED = "completed"
    REJECTED = "rejected"


class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    RESERVED = "reserved"
    SOLD = "sold"
    INACTIVE = "inactive"


class PaymentStatus(str, enum.Enum):
    CREATED = "created"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"

