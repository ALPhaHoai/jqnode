# wrap(), wrapAll(), wrapInner() Methods

Wrap elements with HTML structure.

## wrap(wrappingElement)
Wrap each element individually.

```javascript
$('span').wrap('<div class="wrapper"></div>');
// Each span gets its own wrapper div
```

## wrapAll(wrappingElement)
Wrap all elements together as one group.

```javascript
$('span').wrapAll('<div class="container"></div>');
// All spans wrapped in single container
```

## wrapInner(wrappingElement)
Wrap the content inside each element.

```javascript
$('p').wrapInner('<strong></strong>');
// Wraps content of each p in strong tags
```

## Examples

### wrap() - Individual Wrapping
```javascript
const $ = jq('<div><span>A</span><span>B</span></div>');
$('span').wrap('<div class="box"></div>');
// Result: <div><div class="box"><span>A</span></div><div class="box"><span>B</span></div></div>
```

### wrapAll() - Group Wrapping
```javascript
const $ = jq('<div><span>A</span><span>B</span></div>');
$('span').wrapAll('<div class="container"></div>');
// Result: <div><div class="container"><span>A</span><span>B</span></div></div>
```

### wrapInner() - Content Wrapping
```javascript
const $ = jq('<p>Hello World</p>');
$('p').wrapInner('<em></em>');
// Result: <p><em>Hello World</em></p>
```

## Use Cases
- Add containers to elements
- Apply styling wrappers
- Group elements
- Emphasize content

## Related
- **unwrap()** - Remove wrapper (if implemented)
- **append()/prepend()** - Add content inside
