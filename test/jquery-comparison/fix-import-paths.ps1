# PowerShell script to fix import paths in converted TypeScript files

Write-Host "Fixing import paths in TypeScript files..." -ForegroundColor Cyan

$tsFiles = Get-ChildItem -Recurse -Filter "*.test.ts"

foreach ($file in $tsFiles) {
    # Calculate depth from test/jquery-comparison root
    $relativePath = $file.FullName.Replace((Get-Location).Path + '\', '')
    $depth = ($relativePath -split '[/\\\\]').Count - 1
    
    # Correct paths
    $indexPath = ('../' * $depth) + 'index'
    $utilsDepth = $depth - 1  
    $utilsPath = ('../' * $utilsDepth) + 'utils/jquery-comparison-helpers'
    
    Write-Host "Processing: $($file.Name) (depth=$depth)"
    
    # Read content
    $content = Get-Content $file.FullName -Raw
    
    # Fix import paths - match any number of ../ and replace with correct depth
    $content = $content -replace "import \$ from '[\.\/]+index';", "import `$ from '$indexPath';"
    $content = $content -replace "import \{ ([^}]+) \} from '[\.\/]+utils/jquery-comparison-helpers';", "import { `$1 } from '$utilsPath';"
    
    # Write back
    Set-Content $file.FullName -Value $content -NoNewline
    
    Write-Host "  Fixed: index path = $indexPath, utils path = $utilsPath" -ForegroundColor Green
}

Write-Host "`nImport path fixing complete!" -ForegroundColor Green
Write-Host "Processed $($tsFiles.Count) files" -ForegroundColor Cyan
