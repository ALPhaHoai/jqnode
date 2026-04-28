# html() Method

## Overview

Get or set the HTML content of elements. When getting, returns the innerHTML of the first element. When setting, sets the innerHTML of all matched elements.

## Syntax

### Get HTML:

```javascript
jq(selector).html();
```

### Set HTML:

```javascript
jq(selector).html(htmlString);
```

## Parameters

- **htmlString** (String, optional): HTML string to set as content

## Return Value

- **Get**: String containing HTML content
- **Set**: JQ instance for chaining

## Examples

### Getting HTML

```javascript
const jq = require('@alphahoai/jqnode');

const html = `<div id="container"><p>Hello <strong>World</strong></p></div>`;
const $ = jq(html);

const content = $('#container').html();
console.log(content); // "<p>Hello <strong>World</strong></p>"
```

### Setting HTML

```javascript
const html = `<div id="box"></div>`;
const $ = jq(html);

$('#box').html('<p>New content</p>');
console.log($('#box').html()); // "<p>New content</p>"
```

### Replacing Content

```javascript
const html = `
    <ul id="list">
        <li>Old item</li>
    </ul>
`;
const $ = jq(html);

$('#list').html('<li>New item 1</li><li>New item 2</li>');
console.log($('#list').html());
```

### With Complex HTML

```javascript
const html = `<div id="app"></div>`;
const $ = jq(html);

const newContent = `
    <header>
        <h1>Title</h1>
    </header>
    <main>
        <p>Content here</p>
    </main>
`;

$('#app').html(newContent);
```

## Use Cases

- Load dynamic content
- Replace element contents
- Extract HTML for processing
- Template rendering
- Content updates

## Related Methods

- **text()**: Get/set text content (no HTML)
- **append()**: Add content at end
- **prepend()**: Add content at beginning

##Tips

- Setting html() replaces all existing content
- Use text() if you don't need HTML parsing
- Returns innerHTML, not outerHTML
