# PowerShell script to convert jQuery comparison test files from .js to .ts
# Updates require() statements to ES module imports

$folders = @(
    @{Path="content-methods"; Files=@('html.test.js', 'normalizedText.test.js', 'text.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="data-methods"; Files=@('data.test.js', 'removeData.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="filtering-methods"; Files=@('eq.test.js', 'filter.test.js', 'first.test.js', 'has.test.js', 'is.test.js', 'last.test.js', 'not.test.js', 'slice.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="insertion-methods/inside"; Files=@('append.test.js', 'appendTo.test.js', 'prepend.test.js', 'prependTo.test.js'); ImportPath='../../../utils/jquery-comparison-helpers'},
    @{Path="insertion-methods/outside"; Files=@('after.test.js', 'before.test.js', 'insertAfter.test.js', 'insertBefore.test.js'); ImportPath='../../../utils/jquery-comparison-helpers'},
    @{Path="insertion-methods/wrapping"; Files=@('wrap.test.js', 'wrapAll.test.js', 'wrapInner.test.js'); ImportPath='../../../utils/jquery-comparison-helpers'},
    @{Path="iteration-methods"; Files=@('each.test.js', 'map.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="miscellaneous-methods"; Files=@('clone.test.js', 'get.test.js', 'index.test.js', 'position.test.js', 'remove.test.js', 'toArray.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="selector-methods"; Files=@('additional-selectors.test.js', 'advanced-selectors.test.js', 'basic-selectors.test.js', 'child-selectors.test.js', 'combinators.test.js', 'hierarchy-selectors.test.js', 'pseudo-classes.test.js', 'quotes-and-special-chars-in-selectors.test.js'); ImportPath='../../utils/jquery-comparison-helpers'},
    @{Path="traversal-methods"; Files=@('children.test.js', 'closest.test.js', 'contents.test.js', 'end.test.js', 'find.test.js', 'next.test.js', 'nextAll.test.js', 'nextUntil.test.js', 'parent.test.js', 'parents.test.js', 'parentsUntil.test.js', 'prev.test.js', 'prevAll.test.js', 'prevUntil.test.js', 'siblings.test.js'); ImportPath='../../utils/jquery-comparison-helpers'}
)

foreach ($folder in $folders) {
    $folderPath = Join-Path $PSScriptRoot $folder.Path
    $importPath = $folder.ImportPath
    
    # Determine index depth for proper import path
    $depth = ($folder.Path -split '/').Count + 1
    $indexPath = '../' * $depth + 'index'
    
    Write-Host "Processing folder: $($folder.Path)"
    
    foreach ($file in $folder.Files) {
        $jsFile = Join-Path $folderPath $file
        $tsFile = $jsFile -replace '\.js$', '.ts'
        
        if (Test-Path $jsFile) {
            Write-Host "  Converting: $file"
            
            # Read the original file
            $content = Get-Content $jsFile -Raw
            
            # Replace require statements with ES module imports
            $content = $content -replace "const \$ = require\('.*?index'\);", "import `$ from '$indexPath';"
            $content = $content -replace "const jQuery = require\('jquery'\);", "import jQuery from 'jquery';"
            $content = $content -replace "const \{ ([^}]+) \} = require\('$([regex]::Escape($importPath))'\);", "import { `$1 } from '$importPath';"
            
            # Write to TypeScript file
            Set-Content $tsFile -Value $content -NoNewline
            
            Write-Host "    Created: $tsFile"
        } else {
            Write-Host "  SKIP (not found): $file" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
