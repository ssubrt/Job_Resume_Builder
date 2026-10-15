from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.resume_service import customize_resume, generate_docx_stream

router = APIRouter(tags=["resume"])


class DocxExportRequest(BaseModel):
    markdown: str
    filename: str = "tailored-resume.docx"


@router.post("/customize")
async def customize(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
    sections: str = Form("summary,experience,skills"),
    tone: str = Form("impactful"),
) -> dict:
    return await customize_resume(job_description, resume, sections=sections, tone=tone)


@router.post("/export/docx")
async def export_docx(payload: DocxExportRequest):
    buffer = generate_docx_stream(payload.markdown)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{payload.filename}"'},
    )
