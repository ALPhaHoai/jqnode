# jqnode Methods Documentation

This directory contains comprehensive documentation for all jqnode methods.

## Table of Contents

### ✅ Content Methods

- [x] [findTableWithHeader](./findTableWithHeader.md) - Find tables by header content
- [x] [title](./title-method.md) - Get document title
- [x] [toJSON](./toJSON.md) - Convert tables to JSON
- [ ] [html](./html.md) - Get/set HTML content
- [ ] [text](./text.md) - Get/set text content

### ✅ Attribute Methods

- [x] [attr](./attr.md) - Get/set attributes
- [x] [addClass](./addClass.md) - Add CSS classes
- [ ] [removeClass](./removeClass.md) - Remove CSS classes
- [ ] [toggleClass](./toggleClass.md) - Toggle CSS classes
- [ ] [hasClass](./hasClass.md) - Check if element has class
- [ ] [prop](./prop.md) - Get/set properties
- [ ] [removeAttr](./removeAttr.md) - Remove attributes
- [ ] [removeProp](./removeProp.md) - Remove properties
- [ ] [val](./val.md) - Get/set form values

### ✅ Data Methods

- [x] [data](./data.md) - Store/retrieve data
- [ ] [removeData](./removeData.md) - Remove stored data

### ✅ Iteration Methods

- [x] [each](./each.md) - Iterate over elements
- [ ] [map](./map.md) - Map elements to array

### ✅ Filtering Methods

- [ ] [filter](./filter.md) - Filter elements by selector/function
- [ ] [eq](./eq.md) - Reduce to element at index
- [ ] [first](./first.md) - Get first element
- [ ] [last](./last.md) - Get last element
- [ ] [has](./has.md) - Filter by descendant
- [ ] [is](./is.md) - Check if matches selector
- [ ] [not](./not.md) - Remove matching elements
- [ ] [slice](./slice.md) - Reduce to subset by index range

### ✅ Traversal Methods - Ancestor

- [ ] [parent](./parent.md) -Get immediate parent
- [ ] [parents](./parents.md) - Get all ancestors
- [ ] [closest](./closest.md) - Get closest ancestor matching selector
- [ ] [parentsUntil](./parentsUntil.md) - Get ancestors until selector

### ✅ Traversal Methods - Descendants

- [ ] [children](./children.md) - Get immediate children
- [ ] [find](./find.md) - Find descendants by selector
- [ ] [contents](./contents.md) - Get children including text nodes

### ✅ Traversal Methods - Siblings

- [ ] [siblings](./siblings.md) - Get all siblings
- [ ] [next](./next.md) - Get next sibling
- [ ] [nextAll](./nextAll.md) - Get all following siblings
- [ ] [nextUntil](./nextUntil.md) - Get following siblings until selector
- [ ] [prev](./prev.md) - Get previous sibling
- [ ] [prevAll](./prevAll.md) - Get all previous siblings
- [ ] [prevUntil](./prevUntil.md) - Get previous siblings until selector

### ✅ Insertion Methods - Inside

- [ ] [append](./append.md) - Insert content at end of elements
- [ ] [appendTo](./appendTo.md) - Insert elements at end of target
- [ ] [prepend](./prepend.md) - Insert content at beginning of elements
- [ ] [prependTo](./prependTo.md) - Insert elements at beginning of target

### ✅ Insertion Methods - Outside

- [ ] [after](./after.md) - Insert content after elements
- [ ] [before](./before.md) - Insert content before elements
- [ ] [insertAfter](./insertAfter.md) - Insert elements after target
- [ ] [insertBefore](./insertBefore.md) - Insert elements before target

### ✅ Insertion Methods - Wrapping

- [ ] [wrap](./wrap.md) - Wrap each element
- [ ] [wrapAll](./wrapAll.md) - Wrap all elements as one
- [ ] [wrapInner](./wrapInner.md) - Wrap content of each element

### ✅ Miscellaneous Methods

- [ ] [get](./get.md) - Get DOM element at index
- [ ] [toArray](./toArray.md) - Convert to plain array
- [ ] [size](./size.md) - Get number of elements
- [ ] [index](./index.md) - Get index of element
- [ ] [position](./position.md) - Get position relative to parent
- [ ] [remove](./remove.md) - Remove elements from DOM

### ✅ Traversal - Other

- [ ] [end](./end.md) - End most recent filtering operation

## Documentation Format

Each method documentation includes:

1. **Overview** - Brief description
2. **Syntax** - Method signatures and parameters
3. **Features** - Key capabilities
4. **Examples** - Practical usage examples
5. **Use Cases** - Real-world applications
6. **Related Methods** - Similar or complementary methods
7. **Tips** - Best practices and gotchas

## Example Files

All methods have corresponding example files in `/examples/` directory demonstrating practical usage patterns.

## Contributing

When adding new method documentation:

1. Follow the existing format
2. Include minimum 5-10 practical examples
3. Cover edge cases
4. Add corresponding example file
5. Update this index

## Testing Examples

Run any example file:

```bash
node examples/methodName-usage.js
```

## Questions?

See the main [README.md](../README.md) for project overview and usage.
