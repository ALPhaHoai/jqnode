# Verification script - Check all import statements in TypeScript files

$tsFiles = Get-ChildItem -Recurse -Filter "*.test.ts" | Sort-Object FullName
$errors = @()
$verified = 0

Write-Host "`n=== VERIFYING ALL 59 TYPESCRIPT FILES ===" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $tsFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + '\', '')
    $depth = ($relativePath -split '[/\\]').Count - 1
    
    # Expected paths based on depth
    $expectedIndex = ('../' * ($depth + 1)) + 'index'
    $expectedUtils = ('../' * $depth) + 'utils/jquery-comparison-helpers'
    
    # Read first 5 lines
    $content = Get-Content $file.FullName -TotalCount 5 -Raw
    
    # Check for correct import patterns
    $hasCorrectIndex = $content -match "import \$ from '$([regex]::Escape($expectedIndex))';"
    $hasCorrectUtils = $content -match "import \{ .+ \} from '$([regex]::Escape($expectedUtils))';"
    $hasJQuery = $content -match "import jQuery from 'jquery';"
    
    if ($hasCorrectIndex -and $hasCorrectUtils -and $hasJQuery) {
        Write-Host "✓ $relativePath" -ForegroundColor Green
        $verified++
    } else {
        Write-Host "✗ $relativePath" -ForegroundColor Red
        if (-not $hasCorrectIndex) { Write-Host "  ERROR: Wrong index import (expected: $expectedIndex)" -ForegroundColor Yellow }
        if (-not $hasCorrectUtils) { Write-Host "  ERROR: Wrong utils import (expected: $expectedUtils)" -ForegroundColor Yellow }
        if (-not $hasJQuery) { Write-Host "  ERROR: Missing jQuery import" -ForegroundColor Yellow }
        $errors += $relativePath
    }
}

Write-Host ""
Write-Host "=== VERIFICATION SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total files: $($tsFiles.Count)"
Write-Host "Verified: $verified" -ForegroundColor Green
Write-Host "Errors: $($errors.Count)" -ForegroundColor $(if ($errors.Count -eq 0) { "Green" } else { "Red" })

if ($errors.Count -gt 0) {
    Write-Host "`nFiles with errors:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" }
    exit 1
} else {
    Write-Host "`n✓ ALL FILES VERIFIED SUCCESSFULLY!" -ForegroundColor Green
    exit 0
}
