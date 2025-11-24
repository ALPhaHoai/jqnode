# Refactor JqElement.ts to rename properties
$filePath = "dom\JqElement.ts"
$content = Get-Content $filePath -Raw -Encoding UTF8

# 1. Rename property declarations
$content = $content -replace '(\s+public )type(: NodeType;)', '$1internalType$2'
$content = $content -replace '(\s+public )data(: string = .*;)', '$1textData$2'

# 2. Remove value property declaration line  
$content = $content -replace '\s+public value: string = .*;.*\r?\n', ''

# 3. Replace all references to .type with .internalType
$content = $content -replace '\bthis\.type\b', 'this.internalType'
$content = $content -replace '\bnode\.type\b', 'node.internalType'
$content = $content -replace '\bchild\.type\b', 'child.internalType'
$content = $content -replace '\bc\.type\b', 'c.internalType'
$content = $content -replace '\bsibling\.type\b', 'sibling.internalType'
$content = $content -replace '\bsiblings\[i\]\.type\b', 'siblings[i].internalType'

# 4. Replace all references to .data with .textData
$content = $content -replace '\bthis\.data\b', 'this.textData'
$content = $content -replace '\bnode\.data\b', 'node.textData'
$content = $content -replace '\bchild\.data\b', 'child.textData'
$content = $content -replace '\btextNode\.data\b', 'textNode.textData'
$content = $content -replace '\bcloned\.data\b', 'cloned.textData'

# 5. Remove references to value in cloneNode
$content = $content -replace '\s+cloned\.value = this\.value;\s*\r?\n', ''

# Write back
$content | Set-Content $filePath -Encoding UTF8 -NoNewline

Write-Host "Refactoring complete!"
