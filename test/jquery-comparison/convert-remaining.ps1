# PowerShell script to convert remaining jQuery comparison test files from .js to .ts
# This script handles deeply nested folders

# Get all .js test files recursively
$jsFiles = Get-ChildItem -Recurse -Filter "*.test.js"

Write-Host "Found $($jsFiles.Count) .js test files to convert"

foreach ($jsFile in $jsFiles) {
    $tsFile = $jsFile.FullName -replace '\.js$', '.ts'
    
    Write-Host "Converting: $($jsFile.Name) in $($jsFile.DirectoryName)"
    
    # Read the original file
    $content = Get-Content $jsFile.FullName -Raw
    
    # Figure out the correct path depth for index
    $relativePath = $jsFile.FullName.Replace((Get-Location).Path + '\', '')
    $depth = ($relativePath -split '[/\\\\]').Count - 1
    $indexPath = '../' * $depth + 'index'
    
    # Figure out the correct path for utils
    $utilsDepth = $depth - 1
    $utilsPath = '../' * $utilsDepth + 'utils/jquery-comparison-helpers'
    
    # Replace require statements with ES module imports
    $content = $content -replace "const \$ = require\('.*?index'\);", "import `$ from '$indexPath';"
    $content = $content -replace "const jQuery = require\('jquery'\);", "import jQuery from 'jquery';"
    $content = $content -replace "const \{ ([^}]+) \} = require\('.*?utils/jquery-comparison-helpers'\);", "import { `$1 } from '$utilsPath';"
    
    # Write to TypeScript file
    Set-Content $tsFile -Value $content -NoNewline
    
    Write-Host "  Created: $tsFile"
}

Write-Host "`nConversion complete! Converted $($jsFiles.Count) files." -ForegroundColor Green
