# JQ Class - jQuery API Reference Links

This document provides links to the official jQuery API documentation for each method implemented in the JQ class.

## Core Methods

### `.length`
- **jQuery API**: [.length](https://api.jquery.com/length/)
- **Description**: Gets the number of elements in the collection

### `.find(selector)`
- **jQuery API**: [.find()](https://api.jquery.com/find/)
- **Description**: Finds descendant elements by CSS selector or tag name

## Attributes & Properties

### `.attr(name, [value])`
- **jQuery API**: [.attr()](https://api.jquery.com/attr/)
- **Description**: Gets or sets an attribute on elements

### `.removeAttr(name)`
- **jQuery API**: [.removeAttr()](https://api.jquery.com/removeAttr/)
- **Description**: Removes an attribute from elements

### `.prop(name, [value])`
- **jQuery API**: [.prop()](https://api.jquery.com/prop/)
- **Description**: Gets or sets a property on elements

### `.removeProp(name)`
- **jQuery API**: [.removeProp()](https://api.jquery.com/removeProp/)
- **Description**: Removes a property from elements

### `.val([value])`
- **jQuery API**: [.val()](https://api.jquery.com/val/)
- **Description**: Gets or sets the value of form elements

## CSS Classes

### `.toggleClass(className, [state])`
- **jQuery API**: [.toggleClass()](https://api.jquery.com/toggleClass/)
- **Description**: Adds or removes classes depending on presence or state argument

### `.hasClass(className)`
- **jQuery API**: [.hasClass()](https://api.jquery.com/hasClass/)
- **Description**: Checks if the first element has the specified class

## Content Manipulation

### `.text([value])`
- **jQuery API**: [.text()](https://api.jquery.com/text/)
- **Description**: Gets or sets the text content of elements

### `.html()`
- **jQuery API**: [.html()](https://api.jquery.com/html/)
- **Description**: Gets the inner HTML of the first element

## Iteration

### `.each(callback)`
- **jQuery API**: [.each()](https://api.jquery.com/each/)
- **Description**: Iterates over each element in the collection

### `.map(callback)`
- **jQuery API**: [.map()](https://api.jquery.com/map/)
- **Description**: Translates elements into a new set

## Tree Traversal - Parents

### `.parent([selector])`
- **jQuery API**: [.parent()](https://api.jquery.com/parent/)
- **Description**: Gets the immediate parent of each element

### `.parents([selector])`
- **jQuery API**: [.parents()](https://api.jquery.com/parents/)
- **Description**: Gets all ancestors of each element

### `.parentsUntil([selector], [filter])`
- **jQuery API**: [.parentsUntil()](https://api.jquery.com/parentsUntil/)
- **Description**: Gets ancestors up to but not including the selector

### `.closest(selector)`
- **jQuery API**: [.closest()](https://api.jquery.com/closest/)
- **Description**: Gets the first ancestor (including itself) that matches the selector

## Tree Traversal - Children

### `.children([selector])`
- **jQuery API**: [.children()](https://api.jquery.com/children/)
- **Description**: Gets the immediate children of each element

### `.contents()`
- **jQuery API**: [.contents()](https://api.jquery.com/contents/)
- **Description**: Gets all child nodes including text and comment nodes

## Tree Traversal - Siblings

### `.siblings([selector])`
- **jQuery API**: [.siblings()](https://api.jquery.com/siblings/)
- **Description**: Gets all siblings of each element

### `.next([selector])`
- **jQuery API**: [.next()](https://api.jquery.com/next/)
- **Description**: Gets the immediately following sibling

### `.nextAll([selector])`
- **jQuery API**: [.nextAll()](https://api.jquery.com/nextAll/)
- **Description**: Gets all following siblings

### `.nextUntil([selector], [filter])`
- **jQuery API**: [.nextUntil()](https://api.jquery.com/nextUntil/)
- **Description**: Gets following siblings up to but not including the selector

### `.prev([selector])`
- **jQuery API**: [.prev()](https://api.jquery.com/prev/)
- **Description**: Gets the immediately preceding sibling

### `.prevAll([selector])`
- **jQuery API**: [.prevAll()](https://api.jquery.com/prevAll/)
- **Description**: Gets all preceding siblings

### `.prevUntil([selector], [filter])`
- **jQuery API**: [.prevUntil()](https://api.jquery.com/prevUntil/)
- **Description**: Gets preceding siblings up to but not including the selector

## Filtering

### `.eq(index)`
- **jQuery API**: [.eq()](https://api.jquery.com/eq/)
- **Description**: Selects the element at a specific index

### `.first()`
- **jQuery API**: [.first()](https://api.jquery.com/first/)
- **Description**: Selects the first matched element

### `.last()`
- **jQuery API**: [.last()](https://api.jquery.com/last/)
- **Description**: Selects the last matched element

### `.filter(selectorOrFunction)`
- **jQuery API**: [.filter()](https://api.jquery.com/filter/)
- **Description**: Keeps only elements that match the selector or function

### `.not(selectorOrFunction)`
- **jQuery API**: [.not()](https://api.jquery.com/not/)
- **Description**: Removes elements that match the selector or function

### `.has(selectorOrElement)`
- **jQuery API**: [.has()](https://api.jquery.com/has/)
- **Description**: Keeps elements that have matching descendants

### `.is(selectorOrElement)`
- **jQuery API**: [.is()](https://api.jquery.com/is/)
- **Description**: Checks if any element matches the given arguments

### `.slice(start, [end])`
- **jQuery API**: [.slice()](https://api.jquery.com/slice/)
- **Description**: Reduces the set to a subset by index range

## DOM Insertion - Inside

### `.append(...content)`
- **jQuery API**: [.append()](https://api.jquery.com/append/)
- **Description**: Inserts content at the end of each element

### `.appendTo(target)`
- **jQuery API**: [.appendTo()](https://api.jquery.com/appendTo/)
- **Description**: Inserts selected elements at the end of targets

### `.prepend(...content)`
- **jQuery API**: [.prepend()](https://api.jquery.com/prepend/)
- **Description**: Inserts content at the beginning of each element

### `.prependTo(target)`
- **jQuery API**: [.prependTo()](https://api.jquery.com/prependTo/)
- **Description**: Inserts selected elements at the beginning of targets

## DOM Insertion - Outside

### `.before(...content)`
- **jQuery API**: [.before()](https://api.jquery.com/before/)
- **Description**: Inserts content before each element as a sibling

### `.insertBefore(target)`
- **jQuery API**: [.insertBefore()](https://api.jquery.com/insertBefore/)
- **Description**: Inserts selected elements before each target

### `.after(...content)`
- **jQuery API**: [.after()](https://api.jquery.com/after/)
- **Description**: Inserts content after each element as a sibling

### `.insertAfter(target)`
- **jQuery API**: [.insertAfter()](https://api.jquery.com/insertAfter/)
- **Description**: Inserts selected elements after each target

## DOM Insertion - Wrapping

### `.wrap(wrappingElement)`
- **jQuery API**: [.wrap()](https://api.jquery.com/wrap/)
- **Description**: Wraps an HTML structure around each element

### `.wrapAll(wrappingElement)`
- **jQuery API**: [.wrapAll()](https://api.jquery.com/wrapAll/)
- **Description**: Wraps an HTML structure around all elements together

### `.wrapInner(wrappingElement)`
- **jQuery API**: [.wrapInner()](https://api.jquery.com/wrapInner/)
- **Description**: Wraps an HTML structure around the content of each element

---

## Quick Reference by Category

### Attributes & Properties
[.attr()](https://api.jquery.com/attr/) | [.removeAttr()](https://api.jquery.com/removeAttr/) | [.prop()](https://api.jquery.com/prop/) | [.removeProp()](https://api.jquery.com/removeProp/) | [.val()](https://api.jquery.com/val/)

### CSS Classes
[.toggleClass()](https://api.jquery.com/toggleClass/) | [.hasClass()](https://api.jquery.com/hasClass/)

### Content
[.text()](https://api.jquery.com/text/) | [.html()](https://api.jquery.com/html/)

### Traversal - Parents
[.parent()](https://api.jquery.com/parent/) | [.parents()](https://api.jquery.com/parents/) | [.parentsUntil()](https://api.jquery.com/parentsUntil/) | [.closest()](https://api.jquery.com/closest/)

### Traversal - Children
[.children()](https://api.jquery.com/children/) | [.contents()](https://api.jquery.com/contents/) | [.find()](https://api.jquery.com/find/)

### Traversal - Siblings
[.siblings()](https://api.jquery.com/siblings/) | [.next()](https://api.jquery.com/next/) | [.nextAll()](https://api.jquery.com/nextAll/) | [.nextUntil()](https://api.jquery.com/nextUntil/) | [.prev()](https://api.jquery.com/prev/) | [.prevAll()](https://api.jquery.com/prevAll/) | [.prevUntil()](https://api.jquery.com/prevUntil/)

### Filtering
[.eq()](https://api.jquery.com/eq/) | [.first()](https://api.jquery.com/first/) | [.last()](https://api.jquery.com/last/) | [.filter()](https://api.jquery.com/filter/) | [.not()](https://api.jquery.com/not/) | [.has()](https://api.jquery.com/has/) | [.is()](https://api.jquery.com/is/) | [.slice()](https://api.jquery.com/slice/)

### DOM Insertion - Inside
[.append()](https://api.jquery.com/append/) | [.appendTo()](https://api.jquery.com/appendTo/) | [.prepend()](https://api.jquery.com/prepend/) | [.prependTo()](https://api.jquery.com/prependTo/)

### DOM Insertion - Outside
[.before()](https://api.jquery.com/before/) | [.insertBefore()](https://api.jquery.com/insertBefore/) | [.after()](https://api.jquery.com/after/) | [.insertAfter()](https://api.jquery.com/insertAfter/)

### DOM Insertion - Wrapping
[.wrap()](https://api.jquery.com/wrap/) | [.wrapAll()](https://api.jquery.com/wrapAll/) | [.wrapInner()](https://api.jquery.com/wrapInner/)

### Iteration
[.each()](https://api.jquery.com/each/) | [.map()](https://api.jquery.com/map/)

---

## Notes

- All methods maintain jQuery's chainable API pattern (except getters which return values)
- The JQ class implements a subset of jQuery's API focused on DOM traversal and manipulation
- Some methods may have slight behavioral differences from jQuery due to the server-side parsing context
- For complete jQuery API documentation, visit: https://api.jquery.com/