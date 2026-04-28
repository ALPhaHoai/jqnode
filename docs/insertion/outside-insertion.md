# after(), before(), insertAfter(), insertBefore() Methods

Insert content outside of elements (as siblings).

## after(content)

Insert content after each element.

## before(content)

Insert content before each element.

## insertAfter(target)

Insert elements after target.

## insertBefore(target)

Insert elements before target.

## Examples

### after()

```javascript
$('p').after('<hr>');
// Inserts <hr> after each <p>
```

### before()

```javascript
$('p').before('<h3>Title</h3>');
// Inserts <h3> before each <p>
```

### insertAfter()

```javascript
$('<hr>').insertAfter('p');
// Same as after(), different syntax
```

### insertBefore()

```javascript
$('<h3>Title</h3>').insertBefore('p');
// Same as before(), different syntax
```

## Differences

- **after/before**: Called on existing elements
- **insertAfter/insertBefore**: Called on new content

## Related

- **append()/prepend()** - Insert inside elements
- **appendTo()/prependTo()** - Insert inside target
