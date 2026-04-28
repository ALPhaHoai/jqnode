# Miscellaneous Methods

Utility methods for working with JQ objects and DOM elements.

## get([index])

Get the DOM element(s) from the JQ object.

```javascript
const $ = jq('<div><span>A</span><span>B</span></div>');
const firstSpan = $('span').get(0); // DOM element
const allSpans = $('span').get(); // Array of DOM elements
```

## toArray()

Convert JQ object to plain array of DOM elements.

```javascript
const spans = $('span').toArray();
console.log(Array.isArray(spans)); // true
```

## size()

Get the number of elements in the JQ object.

```javascript
console.log($('span').size()); // 2
// Same as: $('span').length
```

## index([element|selector])

Get the index of an element among its siblings or within a selection.

```javascript
const $ = jq('<ul><li>A</li><li id="b">B</li><li>C</li></ul>');
console.log($('#b').index()); // 1
```

## position()

Get the position of the element relative to its offset parent.

```javascript
const pos = $('#element').position();
console.log(pos.top, pos.left);
```

## Examples

### get() - Extract DOM Elements

```javascript
const $divs = $('div');
const firstDiv = $divs.get(0); // First DOM element
const allDivs = $divs.get(); // Array of all DOM elements

// Use with native DOM API
firstDiv.addEventListener('click', handler);
```

### toArray() - Array Conversion

```javascript
const elements = $('li').toArray();
elements.forEach((el) => {
    console.log(el.textContent);
});
```

### size() - Count Elements

```javascript
if ($('.error').size() > 0) {
    console.log('Has errors');
}
```

### index() - Find Position

```javascript
$('li').each(function () {
    const pos = $(this).index();
    console.log(`Item at index ${pos}`);
});
```

### position() - Get Coordinates

```javascript
const $tooltip = $('#tooltip');
const pos = $tooltip.position();
console.log(`Top: ${pos.top}px, Left: ${pos.left}px`);
```

## Related

- **eq()** - Get JQ object at index
- **length** - Property for element count
- **offset()** - Get position relative to document (if implemented)
