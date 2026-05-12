$slugs = @('python','frontend','java','csharp','cpp','go','rust','php','android','unity','1c','devops','data-engineer','qa','aqa','data-science','data-analyst','business-analyst','product-manager','seo','3d-artist','ai-engineer','reverse-engineer')

Set-Location "C:\Users\123\Documents\Documents\project\interview-platform\server"

foreach ($s in $slugs) {
    Add-Content "data\dedupe-progress.log" "$(Get-Date -Format 'HH:mm:ss') START $s"
    try {
        npx tsx scripts/dedupe-analyze.ts $s 2>&1 | Out-File "data\dedupe-$s.log" -Encoding utf8
        Add-Content "data\dedupe-progress.log" "$(Get-Date -Format 'HH:mm:ss') DONE  $s"
    } catch {
        Add-Content "data\dedupe-progress.log" "$(Get-Date -Format 'HH:mm:ss') ERROR $s : $_"
    }
}
Add-Content "data\dedupe-progress.log" "$(Get-Date -Format 'HH:mm:ss') ALL FINISHED"
