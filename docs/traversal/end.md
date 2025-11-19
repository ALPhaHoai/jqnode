# end() Method

End the most recent filtering operation and return to the previous set of elements.

## Syntax
```javascript
jq(selector).end()
```

## Returns
JQ instance containing the previous set before the last filtering operation

## Examples

### Basic Chaining
```javascript
const $ = jq(`
    <div id="container">
        <p class="text">Paragraph</p>
        <span>Span</span>
    </div>
`);

$('#container')
    .find('p')           // Now working with <p>
    .addClass('found')    // Add class to <p>
    .end()               // Back to #container
    .addClass('processed'); // Add class to #container
```

### Multiple Levels
```javascript
$('div')
    .find('p')
    .addClass('para')
    .end()              // Back to div
    .find('span')
    .addClass('sp')
    .end()              // Back to div
    .addClass('container');
```

### With Filter
```javascript
$('li')
    .filter('.active')
    .css('color', 'red')
    .end()              // Back to all li elements
    .css('background', 'white');
```

## Use Cases
- Complex method chaining
- Apply different operations to different selections
- Navigate selection stack
- Clean chainable code

## Related
- **addBack()** - Add previous set to current
- **filter()** - Filter elements
- **find()** - Find descendants

## Note
Maintains a stack of previous selections. Each filtering/traversal operation can be "ended" to return to the previous state.
