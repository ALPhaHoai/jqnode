# Simple PowerShell script to fix import paths

# Top-level files (2 levels up to index)
$topFiles = @('chaining-patterns.test.ts', 'factory-function.test.ts', 'find-method.test.ts', 'html-parsing.test.ts')
foreach ($file in $topFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace "import \$ from '[^']*index';", "import `$ from '../../index';"
        $content = $content -replace "import \{ ([^}]+) \} from '[^']*utils/jquery-comparison-helpers';", "import { `$1 } from '../utils/jquery-comparison-helpers';"
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    }
}

# Subdirectory files (3 levels up to index)
$subFolders = @('content-methods', 'data-methods', 'filtering-methods', 'iteration-methods', 'miscellaneous-methods', 'selector-methods', 'traversal-methods')
foreach ($folder in $subFolders) {
    Get-ChildItem "$folder\*.test.ts" -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace "import \$ from '[^']*index';", "import `$ from '../../../index';"
        $content = $content -replace "import \{ ([^}]+) \} from '[^']*utils/jquery-comparison-helpers';", "import { `$1 } from '../../utils/jquery-comparison-helpers';"
        Set-Content $_.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($_.Name) in $folder"
    }
}

# Nested subdirectory files (4 levels up to index)
$nestedFolders = @('insertion-methods\inside', 'insertion-methods\outside', 'insertion-methods\wrapping', 'traversal-methods\ancestor', 'traversal-methods\descendant', 'traversal-methods\sibling')
foreach ($folder in $nestedFolders) {
    Get-ChildItem "$folder\*.test.ts" -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace "import \$ from '[^']*index';", "import `$ from '../../../../index';"
        $content = $content -replace "import \{ ([^}]+) \} from '[^']*utils/jquery-comparison-helpers';", "import { `$1 } from '../../../utils/jquery-comparison-helpers';"
        Set-Content $_.FullName -Value $content -NoNewline  
        Write-Host "Fixed: $($_.Name) in $folder"
    }
}

Write-Host "`nAll import paths fixed!" -ForegroundColor Green
