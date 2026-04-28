# contents() Method

Get the children of each element, including text and comment nodes.

## Syntax

```javascript
jq(selector).contents();
```

## Returns

JQ instance containing all child nodes (elements, text, comments)

## Examples

### Get All Contents

```javascript
const $ = jq('<div>Text <span>span</span> more text</div>');
const contents = $('div').contents();
console.log(contents.length); // 3 (text node, span, text node)
```

### Filter Text Nodes

```javascript
contents.each(function () {
    if (this.type === 'text') {
        console.log('Text:', this.data);
    }
});
```

### IFrame Contents

```javascript
// Useful for accessing iframe document
const iframeContents = $('iframe').contents();
```

## Difference from children()

- **children()**: Only element nodes
- **contents()**: All nodes (text, elements, comments)

## Use Cases

- Access text nodes
- Process all child nodes
- IFrame document access
- DOM manipulation including text

## Related

- **children()** - Get element children only
- **find()** - Get all descendants
- **text()** - Get/set text content
