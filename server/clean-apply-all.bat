@echo off
chcp 65001 >nul
REM ПРИМЕНЕНИЕ: удаляет мусор + сливает дубли по всем направлениям
REM ВНИМАНИЕ: необратимо! Сначала проверь JSON-файлы в data\
REM Запусти: clean-apply-all.bat

echo Это удалит мусор и сольёт дубли во ВСЕХ направлениях. Необратимо.
pause

echo ========== 1c ==========
call npm run junk:apply 1c
call npm run dedupe:apply 1c
echo ========== 3d-artist ==========
call npm run junk:apply 3d-artist
call npm run dedupe:apply 3d-artist
echo ========== ai-engineer ==========
call npm run junk:apply ai-engineer
call npm run dedupe:apply ai-engineer
echo ========== android ==========
call npm run junk:apply android
call npm run dedupe:apply android
echo ========== aqa ==========
call npm run junk:apply aqa
call npm run dedupe:apply aqa
echo ========== business-analyst ==========
call npm run junk:apply business-analyst
call npm run dedupe:apply business-analyst
echo ========== cpp ==========
call npm run junk:apply cpp
call npm run dedupe:apply cpp
echo ========== csharp ==========
call npm run junk:apply csharp
call npm run dedupe:apply csharp
echo ========== data-analyst ==========
call npm run junk:apply data-analyst
call npm run dedupe:apply data-analyst
echo ========== data-engineer ==========
call npm run junk:apply data-engineer
call npm run dedupe:apply data-engineer
echo ========== data-science ==========
call npm run junk:apply data-science
call npm run dedupe:apply data-science
echo ========== devops ==========
call npm run junk:apply devops
call npm run dedupe:apply devops
echo ========== frontend ==========
call npm run junk:apply frontend
call npm run dedupe:apply frontend
echo ========== go ==========
call npm run junk:apply go
call npm run dedupe:apply go
echo ========== java ==========
call npm run junk:apply java
call npm run dedupe:apply java
echo ========== php ==========
call npm run junk:apply php
call npm run dedupe:apply php
echo ========== product-manager ==========
call npm run junk:apply product-manager
call npm run dedupe:apply product-manager
echo ========== python ==========
call npm run junk:apply python
call npm run dedupe:apply python
echo ========== qa ==========
call npm run junk:apply qa
call npm run dedupe:apply qa
echo ========== reverse-engineer ==========
call npm run junk:apply reverse-engineer
call npm run dedupe:apply reverse-engineer
echo ========== rust ==========
call npm run junk:apply rust
call npm run dedupe:apply rust
echo ========== seo ==========
call npm run junk:apply seo
call npm run dedupe:apply seo
echo ========== unity ==========
call npm run junk:apply unity
call npm run dedupe:apply unity
echo.
echo ГОТОВО. Все направления очищены.
pause
