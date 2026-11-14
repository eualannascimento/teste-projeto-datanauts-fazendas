"""Infraestrutura base de extração, medição de latência e persistência Bronze/Silver."""

from __future__ import annotations

import json
import time
import traceback
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, Optional

import requests

from etl.config import BRONZE_DIR, DEFAULT_HEADERS, SILVER_DIR


def ensure_dirs() -> None:
    BRONZE_DIR.mkdir(parents=True, exist_ok=True)
    SILVER_DIR.mkdir(parents=True, exist_ok=True)


class BaseExtractor(ABC):
    """Classe base para auditores/extratores ETL de fontes oficiais e parceiras."""

    source_id: str = ""
    name: str = ""
    provider: str = ""
    layer: str = ""
    url: str = ""
    auth_required: str = "Nenhum (100% Aberto)"
    expected_format: str = "JSON"
    spatial_resolution: str = ""
    temporal_resolution: str = ""
    coverage: str = ""
    data_nature: str = "Dado Fatídico (Observado)"
    period_min: str = ""
    period_max: str = ""
    plain_question: str = ""
    plain_answer: str = ""
    fit_score: int = 5
    fit_analysis: str = ""
    viz_type: str = "kv_cards"

    def timed_request(
        self,
        url: str,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 25,
        stream: bool = False,
        method: str = "GET",
        json_body: Optional[Dict[str, Any]] = None,
        retries: int = 2,
    ) -> tuple[requests.Response, int]:
        merged_headers = {**DEFAULT_HEADERS, **(headers or {})}
        last_exc: Optional[Exception] = None
        for attempt in range(retries + 1):
            t0 = time.perf_counter()
            try:
                if method.upper() == "POST":
                    resp = requests.post(
                        url, params=params, json=json_body, headers=merged_headers, timeout=timeout, stream=stream
                    )
                else:
                    resp = requests.get(
                        url, params=params, headers=merged_headers, timeout=timeout, stream=stream
                    )
                latency_ms = int((time.perf_counter() - t0) * 1000)
                if resp.status_code >= 500 and attempt < retries:
                    time.sleep(1.0 * (attempt + 1))
                    continue
                return resp, latency_ms
            except (requests.Timeout, requests.ConnectionError) as exc:
                last_exc = exc
                if attempt < retries:
                    time.sleep(1.5 * (attempt + 1))
                    continue
                raise
        raise last_exc  # pragma: no cover

    def save_bronze(self, filename: str, content: bytes | str) -> Path:
        ensure_dirs()
        target = BRONZE_DIR / filename
        if isinstance(content, bytes):
            target.write_bytes(content)
        else:
            target.write_text(content, encoding="utf-8")
        return target

    def save_silver(self, payload: Dict[str, Any]) -> Path:
        ensure_dirs()
        target = SILVER_DIR / f"{self.source_id}.json"
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return target

    @abstractmethod
    def extract(self) -> Dict[str, Any]:
        """Executa extração, auditoria técnica e retorna registro padronizado."""

    def run(self) -> Dict[str, Any]:
        started = datetime.now(timezone.utc).isoformat()
        try:
            result = self.extract()
        except Exception as exc:
            result = {
                "status": "ERROR",
                "http_status": None,
                "latency_ms": 0,
                "actual_format": self.expected_format,
                "error": f"{type(exc).__name__}: {exc}",
                "traceback": traceback.format_exc(limit=3),
                "raw_sample": "",
                "parsed_data": {},
            }

        record = {
            "id": self.source_id,
            "name": self.name,
            "provider": self.provider,
            "layer": self.layer,
            "url": self.url,
            "auth_required": self.auth_required,
            "expected_format": self.expected_format,
            "actual_format": result.get("actual_format", self.expected_format),
            "spatial_resolution": self.spatial_resolution,
            "temporal_resolution": self.temporal_resolution,
            "coverage": self.coverage,
            "data_nature": result.get("data_nature", self.data_nature),
            "period_min": result.get("period_min", self.period_min),
            "period_max": result.get("period_max", self.period_max),
            "plain_question": result.get("plain_question", self.plain_question),
            "plain_answer": result.get("plain_answer", self.plain_answer),
            "fit_score": result.get("fit_score", self.fit_score),
            "fit_analysis": result.get("fit_analysis", self.fit_analysis),
            "viz_type": self.viz_type,
            "status": result.get("status", "UNKNOWN"),
            "http_status": result.get("http_status"),
            "latency_ms": result.get("latency_ms", 0),
            "audit_notes": result.get("audit_notes", ""),
            "error": result.get("error"),
            "extracted_at": started,
            "raw_sample": result.get("raw_sample", ""),
            "parsed_data": result.get("parsed_data", {}),
        }
        self.save_silver(record)
        return record
