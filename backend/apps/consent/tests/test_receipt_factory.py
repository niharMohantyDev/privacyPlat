import uuid
from datetime import datetime, timezone

from apps.consent.domain.entities import ConsentDecisionEntity, ConsentRecordEntity
from apps.consent.domain.receipt_factory import Sha256ReceiptFactory

RECORD = ConsentRecordEntity(
    id=uuid.uuid4(),
    organization_id=uuid.uuid4(),
    asset_id=None,
    subject_key="device-123",
    region="DE",
    framework="GDPR",
    version=1,
    decisions=(
        ConsentDecisionEntity(purpose_code="analytics", granted=False),
        ConsentDecisionEntity(purpose_code="security", granted=True),
    ),
)


def test_receipt_signature_is_a_sha256_hex_digest():
    receipt = Sha256ReceiptFactory().create(RECORD)
    assert len(receipt.signature) == 64
    int(receipt.signature, 16)  # raises ValueError if not valid hex


def test_signature_is_stable_for_identical_content_and_timestamp():
    fixed_time = datetime(2026, 1, 1, tzinfo=timezone.utc)
    sig_a = Sha256ReceiptFactory._sign(RECORD, fixed_time)
    sig_b = Sha256ReceiptFactory._sign(RECORD, fixed_time)
    assert sig_a == sig_b


def test_signature_changes_if_a_decision_is_tampered_with():
    fixed_time = datetime(2026, 1, 1, tzinfo=timezone.utc)
    tampered = ConsentRecordEntity(
        **{**RECORD.__dict__, "decisions": (ConsentDecisionEntity("analytics", True), RECORD.decisions[1])}
    )
    original_sig = Sha256ReceiptFactory._sign(RECORD, fixed_time)
    tampered_sig = Sha256ReceiptFactory._sign(tampered, fixed_time)
    assert original_sig != tampered_sig
