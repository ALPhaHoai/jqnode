# text() Method

Get or set the text content of elements (without HTML tags).

## Syntax

```javascript
// Get text
jq(selector).text();

// Set text
jq(selector).text(textContent);
```

## Parameters

- **textContent** (String): Plain text to set

## Returns

- Get: Combined text of all elements
- Set: JQ instance (chainable)

## Examples

### Get Text

```javascript
const $ = jq('<div>Hello <strong>World</strong></div>');
console.log($('div').text()); // "Hello World"
```

### Set Text

```javascript
const $ = jq('<div>Old</div>');
$('div').text('New text');
console.log($('div').html()); //"New text" (HTML escaped)
```

### Multiple Elements

```javascript
const $ = jq('<div><p>A</p><p>B</p></div>');
console.log($('p').text()); // "AB" (concatenated)
```

## Related

- html() - Get/set HTML content
- val() - Get/set form values
