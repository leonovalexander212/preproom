@echo off
setlocal
set SRC=%~dp0icons
set DST=%~dp0client\public\icons
if not exist "%DST%" mkdir "%DST%"
copy /Y "%SRC%\1C.svg"                "%DST%\1c.svg"
copy /Y "%SRC%\ai_engineer.svg"       "%DST%\ai-engineer.svg"
copy /Y "%SRC%\aqa.svg"               "%DST%\aqa.svg"
copy /Y "%SRC%\buisnes analytics.svg" "%DST%\business-analyst.svg"
copy /Y "%SRC%\csharp.svg"            "%DST%\csharp.svg"
copy /Y "%SRC%\data analytics.svg"    "%DST%\data-analyst.svg"
copy /Y "%SRC%\data-engineer.svg"     "%DST%\data-engineer.svg"
copy /Y "%SRC%\data-science.svg"      "%DST%\data-science.svg"
copy /Y "%SRC%\devops.svg"            "%DST%\devops.svg"
copy /Y "%SRC%\go.svg"                "%DST%\go.svg"
copy /Y "%SRC%\pm.svg"                "%DST%\product-manager.svg"
copy /Y "%SRC%\reverse.svg"           "%DST%\reverse-engineer.svg"
copy /Y "%SRC%\rust.svg"              "%DST%\rust.svg"
copy /Y "%SRC%\seo.svg"               "%DST%\seo.svg"
copy /Y "%SRC%\unity.svg"             "%DST%\unity.svg"
copy /Y "%SRC%\android.svg"           "%DST%\android.svg"
copy /Y "%SRC%\C++.svg"               "%DST%\cpp.svg"
copy /Y "%SRC%\3D Artist.svg"         "%DST%\three-d.svg"
echo === RESULT ===
dir /B "%DST%"
endlocal
