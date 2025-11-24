# Fix remaining .type and .data references
$files = @(
   "methods\attributes-methods\val.ts",
    "methods\content-methods\html.ts",
    "methods\content-methods\toJSON.ts",
    "methods\filtering-methods\has.ts",
    "methods\insertion-methods\inside\append.ts",
    "methods\insertion-methods\inside\appendTo.ts",
    "methods\insertion-methods\inside\prepend.ts",
    "methods\insertion-methods\inside\prependTo.ts",
    "methods\miscellaneous-methods\index.ts",
    "methods\traversal-methods\ancestor\closest.ts",
    "methods\traversal-methods\ancestor\parent.ts",
    "methods\traversal-methods\ancestor\parents.ts",
    "methods\traversal-methods\sibling\nextUntil.ts",
    "helpers\cloneNode.ts",
    "helpers\hasDescendant.ts",
    "html-parser.ts",
    "index.ts",
    "jq.ts",
    "dom\JqComment.ts"
)

$replacements = @(
    @{From = '\.type\s+==='; To = '.internalType ==='},
    @{From = '\.type\s+!=='; To = '.internalType !=='},
    @{From = '\btarget\.type\b'; To = 'target.internalType'},
    @{From = '\btargetElement\.type\b'; To = 'targetElement.internalType'},
    @{From = '\bfirstNode\.type\b'; To = 'firstNode.internalType'},
    @{From = '\btableNode\.type\b'; To = 'tableNode.internalType'},
    @{From = '\bcurrent\.type\b'; To = 'current.internalType'},
    @{From = '\bparent\.type\b'; To = 'parent.internalType'},
    @{From = '\[\?0\]\.data\b'; To = '[?0].textData'},
    @{From = '\btextNode\.data\b'; To = 'textNode.textData'},
    @{From = 'selector\.type\b'; To = 'selector.internalType'}
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $dirty = $false
        
        foreach ($repl in $replacements) {
            if ($content -match $repl.From) {
                $content = $content -replace $repl.From, $repl.To
                $dirty = $true
            }
        }
        
        if ($dirty) {
            Write-Host "Updating $file"
            $content | Set-Content $file -Encoding UTF8 -NoNewline
        }
    }
}

Write-Host "Done!"
