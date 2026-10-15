from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_export_docx_endpoint() -> None:
    payload = {
        "markdown": "# John Doe\n\n## Professional Summary\nExperienced engineer.\n\n## Skills\n- Python\n- React",
        "filename": "test-resume.docx",
    }
    response = client.post("/api/export/docx", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    assert "test-resume.docx" in response.headers["content-disposition"]
    assert len(response.content) > 0


def test_customize_rejects_unsupported_file_extension() -> None:
    response = client.post(
        "/api/customize",
        data={"job_description": "We are seeking a senior software engineer with Python experience."},
        files={"resume": ("resume.xyz", b"Unsupported file format", "application/octet-stream")},
    )
    assert response.status_code == 415
    assert "Only PDF, DOCX, and TXT" in response.json()["detail"]


def test_customize_rejects_empty_job_description() -> None:
    response = client.post(
        "/api/customize",
        data={"job_description": "   "},
        files={"resume": ("resume.pdf", b"%PDF-1.4 dummy", "application/pdf")},
    )
    assert response.status_code == 400
