@echo off
echo Starting GitHub Profile Finder Backend...
echo.
echo Make sure you have the required dependencies installed:
echo pip install fastapi uvicorn httpx
echo.
echo Starting server on http://localhost:8000
echo.
cd Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause