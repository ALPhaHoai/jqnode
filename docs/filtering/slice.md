# slice() Method

Reduce the set of matched elements to a subset specified by a range of indices.

## Syntax

```javascript
jq(selector).slice(start);
jq(selector).slice(start, end);
```

## Parameters

- **start** (Number): Zero-based index to begin (negative counts from end)
- **end** (Number, optional): Index to end before (not inclusive)

## Returns

JQ instance containing subset of elements

## Examples

### Basic Slice

```javascript
const $ = jq('<ul><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li></ul>');
const subset = $('li').slice(1, 3);
console.log(subset.length); // 2 (indices 1 and 2)
```

### From Index to End

```javascript
const fromTwo = $('li').slice(2);
console.log(fromTwo.length); // 3 (indices 2, 3, 4)
```

### Negative Indices

```javascript
const lastTwo = $('li').slice(-2);
console.log(lastTwo.length); // 2 (last two elements)

const exceptLast = $('li').slice(0, -1);
console.log(exceptLast.length); // 4 (all except last)
```

### Pagination

```javascript
const pageSize = 2;
const page = 2;
const items = $('li').slice(page * pageSize, (page + 1) * pageSize);
// Gets items for page 2 (indices 4-5)
```

## Use Cases

- Pagination
- Get range of elements
- Skip first/last elements
- Split lists into chunks

## Related

- **eq()** - Get single element at index
- **first()** - Get first element
- **last()** - Get last element
- **filter()** - Filter by condition
