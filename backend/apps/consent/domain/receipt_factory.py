"""Concrete ReceiptFactory implementation (Factory pattern)."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone

from .entities import ConsentRecordEntity, ConsentReceipt
from .interfaces import ReceiptFactory


class Sha256ReceiptFactory(ReceiptFactory):
    """
    Signs a receipt with a SHA-256 digest over its canonical content.
    Swappable for a real asymmetric-signing implementation later (e.g. one
    backed by a KMS) without touching ConsentService, since callers only
    depend on the ReceiptFactory interface.
    """

    def create(self, record: ConsentRecordEntity) -> ConsentReceipt:
        issued_at = datetime.now(timezone.utc)
        signature = self._sign(record, issued_at)
        return ConsentReceipt(
            record_id=record.id,
            subject_key=record.subject_key,
            region=record.region,
            framework=record.framework,
            version=record.version,
            decisions=record.decisions,
            issued_at=issued_at,
            signature=signature,
        )

    @staticmethod
    def _sign(record: ConsentRecordEntity, issued_at: datetime) -> str:
        canonical = json.dumps(
            {
                "record_id": str(record.id),
                "subject_key": record.subject_key,
                "region": record.region,
                "framework": record.framework,
                "version": record.version,
                "decisions": sorted(
                    (d.purpose_code, d.granted) for d in record.decisions
                ),
                "issued_at": issued_at.isoformat(),
            },
            sort_keys=True,
        )
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()
