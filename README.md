# calculator-by-github-copilot

A modern calculator web app powered by a **FastAPI** backend and a simple **HTML/CSS/JavaScript** frontend.

## Features

- Clean, modern UI
- Button + keyboard input support
- Expression evaluation via REST endpoint
- Error handling (invalid characters, division by zero)

## Tech Stack

- Backend: Python, FastAPI, Uvicorn
- Frontend: HTML, CSS, JavaScript (served as static files)

## Project Structure

- `calculator.py` — FastAPI app + `/api/calc` endpoint
- `static/index.html` — Calculator UI
- `static/style.css` — Styling
- `static/script.js` — Frontend logic

## Getting Started

### 1) Install dependencies

```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate  # Windows PowerShell

pip install fastapi uvicorn
```

### 2) Run the server

```bash
python calculator.py
```

Then open `http://localhost:8000`.

## API

### `GET /api/calc`

Query param:

- `expression` (string) — mathematical expression to evaluate (e.g. `2+2*(3-1)`)

Example:

```bash
curl "http://localhost:8000/api/calc?expression=2%2B2"
```

Response:

```json
{
  "expression": "2+2",
  "result": 4,
  "error": null
}
```

## Notes / Security

This project currently uses `eval()` on the backend with a basic allow-list of characters. Do **not** expose it publicly without additional hardening.

## License

Add a license if you plan to distribute this project.