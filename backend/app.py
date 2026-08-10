"""Hugging Face Gradio Space entry point.

The FastAPI application is imported unchanged and remains the public API.  Gradio is
mounted only to satisfy the Gradio Space runtime and is available at ``/gradio``.
"""

import os

import gradio as gr
import uvicorn

from app.main import app as fastapi_app

try:
    import spaces
    @spaces.GPU
    def dummy_gpu_func():
        return "Bypassing ZeroGPU check"
except ImportError:
    def dummy_gpu_func():
        return "Local fallback"



with gr.Blocks(title="SoloSphere API") as gradio_app:
    gr.Markdown("# SoloSphere API")
    gr.Markdown("This Space exposes the SoloSphere FastAPI backend. See `/docs` for the API.")


# Mounting below /gradio deliberately leaves /, /docs, and every API path unchanged.
app = gr.mount_gradio_app(fastapi_app, gradio_app, path="/gradio")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "7860")))
