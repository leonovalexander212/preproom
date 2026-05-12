@echo off
chcp 65001 >nul
cd /d "C:\Users\123\Documents\Documents\project\interview-platform\server"

set LLM_PROVIDER=ollama
set OLLAMA_BASE_URL=http://localhost:11434/v1
set OLLAMA_MODEL=qwen2.5:14b

echo ============================================
echo   PrepRoom — LLM дедупликация всех направлений
echo   Старт: %date% %time%
echo ============================================
echo.

set SLUGS=data-analyst ai-engineer reverse-engineer seo 1c business-analyst unity cpp data-engineer data-science product-manager rust 3d-artist android aqa csharp devops frontend go java php python qa

for %%S in (%SLUGS%) do (
    echo.
    echo ═══════════════════════════════════════
    echo   %%S — analyze
    echo ═══════════════════════════════════════
    call npx tsx scripts/dedupe-analyze.ts %%S
    if exist "data\%%S-dedupe-suggestions.json" (
        echo   %%S — apply
        call npx tsx scripts/dedupe-apply.ts %%S
    ) else (
        echo   %%S — нет suggestions, пропускаю apply
    )
)

echo.
echo ============================================
echo   Готово! %date% %time%
echo ============================================
pause
