# PowerShell script to properly fix import paths in TypeScript test files
# Files are in test/jquery-comparison/[...], need to go up to project root for index

Write-Host "Fixing import paths (second pass)..." -ForegroundColor Cyan

$tsFiles = Get-ChildItem -Recurse -Filter "*.test.ts"
$baseDir = Get-Location

foreach ($file in $tsFiles) {
    # Calculate depth from test/jquery-comparison
    $relativePath = $file.FullName.Replace($baseDir.Path + '\', '').Replace('\', '/')
    $parts = $relativePath -split '/'
    $depth = $parts.Count
    
    # For test/jquery-comparison/*.test.ts -> need ../../index (2 levels up)
    # For test/jquery-comparison/subfolder/*.test.ts -> need ../../../index (3 levels up)
    # For test/jquery-comparison/sub1/sub2/*.test.ts -> need ../../../../index (4 levels up)
    
    $indexPath = ('../' * ($depth + 1)) + 'index'
    $utilsPath = ('../' * $depth) + 'utils/jquery-comparison-helpers'
    
    Write-Host "Processing: $relativePath (parts=$($parts.Count), indexPath=$indexPath)"
    
    # Read content
    $content = Get-Content $file.FullName -Raw
    
    # Fix import paths - replace any existing paths
    $content = $content -replace "import \$ from '[\.\/]*index';", "import `$ from '$indexPath';"
    $content = $content -replace "import \{ ([^}]+) \} from '[\.\/]*utils/jquery-comparison-helpers';", "import { `$1 } from '$utilsPath';"
    
    # Write back
    Set-Content $file.FullName -Value $content -NoNewline
    
    Write-Host "  ✓ Fixed: $ from '$indexPath', utils from '$utilsPath'" -ForegroundColor Green
}

Write-Host "`nImport path fixing complete!" -ForegroundColor Green
Write-Host "Processed $($tsFiles.Count) files" -ForegroundColor Cyan
