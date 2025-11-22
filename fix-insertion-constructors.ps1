$files = @(
    "methods/insertion-methods/outside/insertBefore.ts",
    "methods/insertion-methods/outside/insertAfter.ts",
    "methods/insertion-methods/inside/prependTo.ts",
    "methods/insertion-methods/inside/appendTo.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Replace new this.constructor(nodes) with Object.create pattern
    $content = $content -replace 'targetJQ = new this\.constructor\(([^)]+)\);', @'
const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = $1;
        result.length = Array.isArray($1) ? $1.length : 0;
        targetJQ = result;
'@
    
    Set-Content $file $content -NoNewline
    Write-Host "Fixed $file"
}
