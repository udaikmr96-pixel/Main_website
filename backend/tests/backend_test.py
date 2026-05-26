"""Backend API tests for Lumen Works landing page."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://service-portal-225.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --------- Health ---------
class TestHealth:
    def test_health_returns_200_and_db_connected(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("db") == "connected"


# --------- Services / Languages ---------
class TestStaticData:
    def test_services_returns_three(self, client):
        r = client.get(f"{API}/services", timeout=15)
        assert r.status_code == 200
        services = r.json().get("services", [])
        assert isinstance(services, list)
        assert len(services) == 3
        ids = {s["id"] for s in services}
        assert ids == {"design-hosting", "workflow-automation", "linguistic-services"}
        for s in services:
            assert s.get("title")
            assert s.get("summary")
            assert isinstance(s.get("deliverables"), list) and len(s["deliverables"]) >= 1

    def test_languages_returns_eight(self, client):
        r = client.get(f"{API}/languages", timeout=15)
        assert r.status_code == 200
        langs = r.json().get("languages", [])
        assert isinstance(langs, list)
        assert len(langs) == 8
        for expected in ["English", "Spanish", "French", "German",
                         "Portuguese", "Arabic", "Mandarin", "Japanese"]:
            assert expected in langs


# --------- Contact ---------
class TestContact:
    def test_create_contact_valid_persists(self, client):
        unique = f"TEST_{int(time.time()*1000)}"
        payload = {
            "name": f"{unique} Name",
            "email": f"test_{int(time.time()*1000)}@example.com",
            "company": "TEST_Co",
            "service_interest": "design-hosting",
            "message": f"Hello from {unique}",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["service_interest"] == payload["service_interest"]
        assert data["message"] == payload["message"]
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data

        # Verify GET lists this submission
        r2 = client.get(f"{API}/contact", timeout=15)
        assert r2.status_code == 200
        entries = r2.json()
        assert isinstance(entries, list)
        ids = {e["id"] for e in entries}
        assert data["id"] in ids
        # No mongo _id leak
        for e in entries:
            assert "_id" not in e

    def test_invalid_email_returns_422(self, client):
        payload = {
            "name": "TEST Bad Email",
            "email": "not-an-email",
            "company": "",
            "service_interest": "design-hosting",
            "message": "hi",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_missing_required_fields_returns_422(self, client):
        payload = {"email": "x@example.com"}
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_empty_message_returns_422(self, client):
        payload = {
            "name": "TEST",
            "email": "x@example.com",
            "service_interest": "design-hosting",
            "message": "",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422, r.text
