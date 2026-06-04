@echo off
chcp 65001 >nul
REM Анализ мусора + дубликатов по всем направлениям (безопасно, только пишет JSON)
REM Запусти: clean-analyze-all.bat

echo ========== 1c ==========
call npm run junk:analyze 1c
call npm run dedupe:analyze 1c
echo ========== 3d-artist ==========
call npm run junk:analyze 3d-artist
call npm run dedupe:analyze 3d-artist
echo ========== ai-engineer ==========
call npm run junk:analyze ai-engineer
call npm run dedupe:analyze ai-engineer
echo ========== android ==========
call npm run junk:analyze android
call npm run dedupe:analyze android
echo ========== aqa ==========
call npm run junk:analyze aqa
call npm run dedupe:analyze aqa
echo ========== business-analyst ==========
call npm run junk:analyze business-analyst
call npm run dedupe:analyze business-analyst
echo ========== cpp ==========
call npm run junk:analyze cpp
call npm run dedupe:analyze cpp
echo ========== csharp ==========
call npm run junk:analyze csharp
call npm run dedupe:analyze csharp
echo ========== data-analyst ==========
call npm run junk:analyze data-analyst
call npm run dedupe:analyze data-analyst
echo ========== data-engineer ==========
call npm run junk:analyze data-engineer
call npm run dedupe:analyze data-engineer
echo ========== data-science ==========
call npm run junk:analyze data-science
call npm run dedupe:analyze data-science
echo ========== devops ==========
call npm run junk:analyze devops
call npm run dedupe:analyze devops
echo ========== frontend ==========
call npm run junk:analyze frontend
call npm run dedupe:analyze frontend
echo ========== go ==========
call npm run junk:analyze go
call npm run dedupe:analyze go
echo ========== java ==========
call npm run junk:analyze java
call npm run dedupe:analyze java
echo ========== php ==========
call npm run junk:analyze php
call npm run dedupe:analyze php
echo ========== product-manager ==========
call npm run junk:analyze product-manager
call npm run dedupe:analyze product-manager
echo ========== python ==========
call npm run junk:analyze python
call npm run dedupe:analyze python
echo ========== qa ==========
call npm run junk:analyze qa
call npm run dedupe:analyze qa
echo ========== reverse-engineer ==========
call npm run junk:analyze reverse-engineer
call npm run dedupe:analyze reverse-engineer
echo ========== rust ==========
call npm run junk:analyze rust
call npm run dedupe:analyze rust
echo ========== seo ==========
call npm run junk:analyze seo
call npm run dedupe:analyze seo
echo ========== unity ==========
call npm run junk:analyze unity
call npm run dedupe:analyze unity
echo.
echo ВСЕ направления проанализированы. Проверь JSON в папке data\, потом применяй.
pause
