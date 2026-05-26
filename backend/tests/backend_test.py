"""Backend API tests for Individual Stake landing page (iteration 2)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "stake-admin-2025"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(client):
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


# --------- Health ---------
class TestHealth:
    def test_health(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("db") == "connected"


# --------- Languages / Services ---------
class TestStaticData:
    def test_languages_returns_nine_with_hindi_first(self, client):
        r = client.get(f"{API}/languages", timeout=15)
        assert r.status_code == 200
        body = r.json()
        langs = body.get("languages", [])
        assert isinstance(langs, list)
        assert len(langs) == 9
        assert langs[0] == "Hindi"
        assert body.get("highlight") == "Hindi"
        for expected in ["Hindi", "English", "Spanish", "French", "German",
                         "Portuguese", "Arabic", "Mandarin", "Japanese"]:
            assert expected in langs

    def test_services_returns_three(self, client):
        r = client.get(f"{API}/services", timeout=15)
        assert r.status_code == 200
        services = r.json().get("services", [])
        assert len(services) == 3


# --------- Contact ---------
class TestContact:
    def test_create_contact_valid(self, client):
        unique = f"TEST_{int(time.time()*1000)}"
        payload = {
            "name": f"{unique} Name",
            "email": f"test_{int(time.time()*1000)}@example.com",
            "company": "TEST_Co",
            "service_interest": "design-hosting",
            "message": f"Hello from {unique}",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["service_interest"] == payload["service_interest"]
        assert "_id" not in data
        assert isinstance(data["id"], str) and len(data["id"]) > 0

    def test_invalid_email_returns_422(self, client):
        r = client.post(f"{API}/contact", json={
            "name": "TEST", "email": "not-an-email",
            "service_interest": "design-hosting", "message": "hi",
        }, timeout=15)
        assert r.status_code == 422

    def test_missing_required_returns_422(self, client):
        r = client.post(f"{API}/contact", json={"email": "x@example.com"}, timeout=15)
        assert r.status_code == 422


# --------- Admin Auth ---------
class TestAdminAuth:
    def test_login_wrong_password_401(self, client):
        r = client.post(f"{API}/admin/login", json={"password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_login_correct_password_200(self, client):
        r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
        assert "expires_at" in data

    def test_me_without_token_401(self, client):
        r = client.get(f"{API}/admin/me", timeout=15)
        assert r.status_code == 401

    def test_me_bad_token_401(self, client):
        r = client.get(f"{API}/admin/me",
                       headers={"Authorization": "Bearer not-a-real-token"}, timeout=15)
        assert r.status_code == 401

    def test_me_valid_token_200(self, client, admin_token):
        r = client.get(f"{API}/admin/me",
                       headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        assert r.status_code == 200
        assert r.json().get("authenticated") is True


# --------- Admin Contact ---------
class TestAdminContact:
    def test_list_without_token_401(self, client):
        r = client.get(f"{API}/admin/contact", timeout=15)
        assert r.status_code == 401

    def test_list_with_token_returns_sorted_desc(self, client, admin_token):
        # Seed two submissions
        for i in range(2):
            client.post(f"{API}/contact", json={
                "name": f"TEST_Admin_{i}_{int(time.time()*1000)}",
                "email": f"admin_test_{i}_{int(time.time()*1000)}@example.com",
                "company": "TEST",
                "service_interest": "workflow-automation",
                "message": f"admin test {i}",
            }, timeout=15)
            time.sleep(0.05)

        r = client.get(f"{API}/admin/contact",
                       headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 2
        # No mongo _id leak
        for it in items:
            assert "_id" not in it
        # Verify sort desc by created_at
        ts = [it["created_at"] for it in items]
        assert ts == sorted(ts, reverse=True)

    def test_delete_without_token_401(self, client):
        r = client.delete(f"{API}/admin/contact/some-id", timeout=15)
        assert r.status_code == 401

    def test_delete_nonexistent_404(self, client, admin_token):
        r = client.delete(f"{API}/admin/contact/does-not-exist-{int(time.time())}",
                          headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        assert r.status_code == 404

    def test_delete_existing_succeeds_and_removes(self, client, admin_token):
        # Create a submission
        create = client.post(f"{API}/contact", json={
            "name": f"TEST_ToDelete_{int(time.time()*1000)}",
            "email": f"todelete_{int(time.time()*1000)}@example.com",
            "company": "TEST",
            "service_interest": "linguistic-services",
            "message": "delete me",
        }, timeout=15).json()
        sid = create["id"]

        # Delete it
        d = client.delete(f"{API}/admin/contact/{sid}",
                          headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        assert d.status_code == 200
        assert d.json().get("status") == "deleted"

        # Verify gone from list
        r = client.get(f"{API}/admin/contact",
                       headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        ids = {it["id"] for it in r.json()}
        assert sid not in ids


# --------- Admin Logout ---------
class TestAdminLogout:
    def test_logout_invalidates_token(self, client):
        # Get a fresh token
        login = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
        token = login.json()["token"]

        # Confirm it works
        r = client.get(f"{API}/admin/me",
                       headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert r.status_code == 200

        # Logout
        r = client.post(f"{API}/admin/logout",
                        headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert r.status_code == 200

        # Subsequent /admin/me with the same token must 401
        r = client.get(f"{API}/admin/me",
                       headers={"Authorization": f"Bearer {token}"}, timeout=15)
        assert r.status_code == 401
