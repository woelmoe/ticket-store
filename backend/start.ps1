Write-Host "Запуск бэкенда ERP..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot"

if (-not (Test-Path ".\.venv\Scripts\Activate.ps1")) {
    Write-Host "Ошибка: Виртуальное окружение .venv не найдено в папке backend!" -ForegroundColor Red
    exit
}

. .\.venv\Scripts\Activate.ps1

uvicorn app.main:app --reload --port 8000