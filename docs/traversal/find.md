# find() Method

Get descendants of each element matching the selector.

## Syntax
```javascript
jq(selector).find(selector)
```

## Parameters
- **selector** (String): CSS selector to match descendants

## Returns
JQ instance containing matched descendants

## Examples

### Find by Tag
```javascript
const $ = jq('<div><p>Text</p><span>More</span></div>');
const paragraphs = $('div').find('p');
console.log(paragraphs.length); // 1
```

### Find by Class
```javascript
const $ = jq('<div><span class="active">A</span><span>B</span></div>');
const active = $('div').find('.active');
console.log(active.text()); // "A"
```

### Nested Find
```javascript
const $ = jq('<div><ul><li><a>Link</a></li></ul></div>');
const links = $('div').find('li').find('a');
console.log(links.length); // 1
```

## Related
- children() - Get immediate children only
- filter() - Filter current set
- closest() - Find closest ancestor
