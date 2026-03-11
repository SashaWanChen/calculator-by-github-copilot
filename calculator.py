from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import uvicorn
import webbrowser
import threading

app = FastAPI(title="Calculator API")


def open_browser():
    """Open browser after a short delay to let server start."""
    webbrowser.open("http://localhost:8000")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    """Serve the calculator UI."""
    return FileResponse("static/index.html")


@app.get("/api/calc")
async def calculate(
    expression: str = Query(..., description="Mathematical expression to evaluate")
):
    """
    Evaluate a mathematical expression and return the result as JSON.
    
    Example: /api/calc?expression=2+2
    """
    try:
        # Safe evaluation - only allow basic math operations
        allowed_chars = set("0123456789+-*/().% ")
        if not all(c in allowed_chars for c in expression):
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid characters in expression", "result": None}
            )
        
        # Evaluate the expression
        result = eval(expression)
        
        return {
            "expression": expression,
            "result": result,
            "error": None
        }
    except ZeroDivisionError:
        return JSONResponse(
            status_code=400,
            content={"expression": expression, "result": None, "error": "Division by zero"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"expression": expression, "result": None, "error": str(e)}
        )


if __name__ == "__main__":
    # Open browser automatically after a short delay
    threading.Timer(1.0, open_browser).start()
    uvicorn.run(app, host="0.0.0.0", port=8000)
