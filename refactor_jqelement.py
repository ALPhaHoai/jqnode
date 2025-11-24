#!/usr/bin/env python3
"""
Refactor JqElement.ts to rename properties and avoid conflicts with HTML element classes.
- Rename 'type' to 'internalType'
- Rename 'data' to 'textData'
- Remove 'value' property and its usages
"""

import re

# Read the file
with open('dom/JqElement.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Rename property declarations
content = re.sub(r'(\s+public )type(: NodeType;)', r'\1internalType\2', content)
content = re.sub(r'(\s+public )data(: string = .*;)', r'\1textData\2', content)

# 2. Remove value property declaration line
content = re.sub(r'\s+public value: string = .*?;.*?\n', '', content)

# 3. Replace all references to `.type` with `.internalType`
content = re.sub(r'\bthis\.type\b', 'this.internalType', content)
content = re.sub(r'\bnode\.type\b', 'node.internalType', content)
content = re.sub(r'\bchild\.type\b', 'child.internalType', content)
content = re.sub(r'\bc\.type\b', 'c.internalType', content)
content = re.sub(r'\bsibling\.type\b', 'sibling.internalType', content)
content = re.sub(r'\bfirstElement\.type\b', 'firstElement.internalType', content)
content = re.sub(r'\blastElement\.type\b', 'lastElement.internalType', content)

# 4. Replace all references to `.data` with `.textData`
content = re.sub(r'\bthis\.data\b', 'this.textData', content)
content = re.sub(r'\bnode\.data\b', 'node.textData', content)
content = re.sub(r'\bchild\.data\b', 'child.textData', content)
content = re.sub(r'\btextNode\.data\b', 'textNode.textData', content)

# 5. Remove references to cloned.value and this.value in cloneNode
content = re.sub(r'\s+cloned\.value = this\.value;\s*\n', '', content)

# Write the file back
with open('dom/JqElement.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactoring complete!")
