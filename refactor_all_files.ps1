# Refactor all remaining files
$files = @(
    "dom\JqText.ts",
    "dom\JqComment.ts",
    "dom\JqCDATASection.ts",
    "selector.ts",
    "utils.ts",
    "utils-static.ts",
    "index.ts",
    "helpers\cloneNode.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Replace all references to .type with .internalType
        $content = $content -replace '\bnode\.type\b', 'node.internalType'
        $content = $content -replace '\bchild\.type\b', 'child.internalType'
        $content = $content -replace '\bc\.type\b', 'c.internalType'
        $content = $content -replace '\bn\.type\b', 'n.internalType'
        $content = $content -replace '\bsibling\.type\b', 'sibling.internalType'
        $content = $content -replace '\bsiblings\[i\]\.type\b', 'siblings[i].internalType'
        $content = $content -replace '\bnextSibling\.type\b', 'nextSibling.internalType'
        
        # Replace all references to .data with .textData
        $content = $content -replace '\bnode\.data\b', 'node.textData'
        $content = $content -replace '\bchild\.data\b', 'child.textData'
        $content = $content -replace '\bcloned\.data\b', 'cloned.textData'
        
        $content | Set-Content $file -Encoding UTF8 -NoNewline
    }
}

Write-Host "All files refactored!"
