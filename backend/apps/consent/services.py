"""
ConsentService — the one place that orchestrates the "record consent" and
"read current consent" use cases.

Single Responsibility: this class does exactly one thing (consent
use-case orchestration) and delegates everything else — persistence to
ConsentRepository, region rules to RegionRuleStrategy, receipt signing to
ReceiptFactory, audit trail to apps.auditlog. It depends only on
interfaces (Dependency Inversion), all supplied via the constructor
(Dependency Injection), so it can be unit-tested with fakes and swapped
onto a different persistence backend without any of its own code
changing.
"""

from __future__ import annotations

import uuid
from typing import Callable

from apps.consent.domain.entities import ConsentDecisionEntity, ConsentRecordEntity, ConsentReceipt
from apps.consent.domain.interfaces import ConsentRepository, ReceiptFactory
from apps.consent.domain.strategies import RegionStrategyFactory


class ConsentService:
    def __init__(
        self,
        repository: ConsentRepository,
        receipt_factory: ReceiptFactory,
        audit_logger: Callable[..., None] | None = None,
        strategy_factory: type[RegionStrategyFactory] = RegionStrategyFactory,
    ):
        self._repository = repository
        self._receipt_factory = receipt_factory
        self._audit_logger = audit_logger
        self._strategy_factory = strategy_factory

    def record_consent(
        self,
        *,
        organization_id: uuid.UUID,
        asset_id: uuid.UUID | None,
        subject_key: str,
        region: str,
        decisions: dict[str, bool],
        actor=None,
        request=None,
    ) -> ConsentReceipt:
        strategy = self._strategy_factory.get_strategy(region)
        purposes = self._repository.get_purposes(organization_id)
        latest = self._repository.get_latest(organization_id, subject_key)
        next_version = (latest.version + 1) if latest else 1

        resolved = tuple(
            ConsentDecisionEntity(
                purpose_code=purpose.code,
                granted=self._resolve_decision(purpose, decisions, strategy),
            )
            for purpose in purposes
        )

        record = ConsentRecordEntity(
            id=uuid.uuid4(),
            organization_id=organization_id,
            asset_id=asset_id,
            subject_key=subject_key,
            region=region,
            framework=strategy.framework_code,
            version=next_version,
            decisions=resolved,
        )
        saved = self._repository.save(record)
        receipt = self._receipt_factory.create(saved)

        if self._audit_logger:
            self._audit_logger(
                action="consent.given" if next_version == 1 else "consent.updated",
                entity_type="ConsentRecord",
                entity_id=saved.id,
                actor=actor,
                organization=organization_id,
                metadata={
                    "subject_key": subject_key,
                    "framework": saved.framework,
                    "version": saved.version,
                },
                request=request,
            )

        return receipt

    def get_current_consent(
        self, *, organization_id: uuid.UUID, subject_key: str
    ) -> ConsentRecordEntity | None:
        return self._repository.get_latest(organization_id, subject_key)

    def list_records(self, *, organization_id: uuid.UUID) -> list[ConsentRecordEntity]:
        return self._repository.list_records(organization_id)

    @staticmethod
    def _resolve_decision(purpose, decisions: dict[str, bool], strategy) -> bool:
        if purpose.is_essential:
            return True
        if purpose.code in decisions:
            return bool(decisions[purpose.code])
        # No explicit choice: opt-in regions (GDPR/DPDP) default to denied,
        # opt-out regions (CCPA) default to granted.
        return not strategy.requires_opt_in(purpose)
