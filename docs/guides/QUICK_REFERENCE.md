# jqnode Quick Reference Guide

Comprehensive quick reference for all jqnode methods with examples.

## Content Manipulation

### html([htmlString])
Get or set HTML content.
```javascript
$('div').html(); // Get
$('div').html('<p>New</p>'); // Set
```

### text([textString])
Get or set text content.
```javascript
$('div').text(); // Get "Hello World"  
$('div').text('New text'); // Set
```

## CSS Classes

### addClass(className)
Add one or more classes.
```javascript
$('div').addClass('active');
$('div').addClass('foo bar baz');
```

### removeClass(className)
Remove one or more classes.
```javascript
$('div').removeClass('active');
$('div').removeClass('foo bar');
```

### toggleClass(className [, state])
Toggle class on/off.
```javascript
$('div').toggleClass('active');
$('div').toggleClass('active', true); // Force add
```

### hasClass(className)
Check if element has class.
```javascript
$('div').hasClass('active'); // true/false
```

## Attributes & Properties

### attr(name [, value])
Get or set attributes.
```javascript
$('img').attr('src'); // Get
$('img').attr('src', 'new.jpg'); // Set
```

### removeAttr(name)
Remove attribute.
```javascript
$('div').removeAttr('data-id');
```

### prop(name [, value])
Get or set properties.
```javascript
$(':checkbox').prop('checked'); // Get
$(':checkbox').prop('checked', true); // Set
```

### removeProp(name)
Remove property.
```javascript
$('input').removeProp('checked');
```

### val([value])
Get or set form values.
```javascript
$('input').val(); // Get
$('input').val('new value'); // Set
```

## Data Storage

### data([key] [, value])
Store/retrieve arbitrary data.
```javascript
$('div').data('userId', 123); // Set
$('div').data('userId'); // Get 123
$('div').data(); // Get all
```

### removeData([key])
Remove stored data.
```javascript
$('div').removeData('userId');
```

## Iteration

### each(function(index, element))
Iterate over elements.
```javascript
$('li').each(function(i, el) {
    console.log(i, $(el).text());
});
```

### map(function(index, element))
Map elements to new array.
```javascript
const texts = $('li').map(function() {
    return $(this).text();
}).get();
```

## Filtering

### filter(selector | function)
Reduce to matching elements.
```javascript
$('div').filter('.active');
$('div').filter(function() { return $(this).hasClass('foo'); });
```

### eq(index)
Get element at index.
```javascript
$('li').eq(0); // First
$('li').eq(-1); // Last
```

### first()
Get first element.
```javascript
$('li').first();
```

### last()
Get last element.
```javascript
$('li').last();
```

### has(selector)
Filter by descendant.
```javascript
$('div').has('p'); // divs containing p
```

### is(selector)
Check if matches selector.
```javascript
$('div').is('.active'); // true/false
```

### not(selector | function)
Remove matching elements.
```javascript
$('div').not('.ignore');
```

### slice(start [, end])
Get subset by range.
```javascript
$('li').slice(1, 3); // Items 1-2
```

## Traversal - Ancestors

### parent([selector])
Get immediate parent.
```javascript
$('span').parent();
$('span').parent('.container');
```

### parents([selector])
Get all ancestors.
```javascript
$('span').parents();
$('span').parents('div');
```

### closest(selector)
Get closest ancestor matching selector.
```javascript
$('span').closest('.container');
```

### parentsUntil(selector [, filter])
Get ancestors until selector.
```javascript
$('span').parentsUntil('.stop');
```

## Traversal - Descendants

### children([selector])
Get immediate children.
```javascript
$('ul').children();
$('ul').children('.active');
```

### find(selector)
Get descendants matching selector.
```javascript
$('div').find('p');
$('div').find('.class');
```

### contents()
Get all children including text nodes.
```javascript
$('div').contents();
```

## Traversal - Siblings

### siblings([selector])
Get all siblings.
```javascript
$('li').siblings();
$('li').siblings('.active');
```

### next([selector])
Get next sibling.
```javascript
$('li').next();
```

### nextAll([selector])
Get all following siblings.
```javascript
$('li').nextAll();
```

### nextUntil(selector [, filter])
Get following siblings until selector.
```javascript
$('li').nextUntil('.stop');
```

### prev([selector])
Get previous sibling.
```javascript
$('li').prev();
```

### prevAll([selector])
Get all previous siblings.
```javascript
$('li').prevAll();
```

### prevUntil(selector [, filter])
Get previous siblings until selector.
```javascript
$('li').prevUntil('.stop');
```

## Traversal - Chain Control

### end()
Return to previous selection.
```javascript
$('div').find('p').addClass('text').end().addClass('container');
```

## DOM Insertion - Inside

### append(content)
Insert at end of elements.
```javascript
$('ul').append('<li>New</li>');
```

### appendTo(target)
Insert elements at end of target.
```javascript
$('<li>New</li>').appendTo('ul');
```

### prepend(content)
Insert at beginning of elements.
```javascript
$('ul').prepend('<li>First</li>');
```

### prependTo(target)
Insert elements at beginning of target.
```javascript
$('<li>First</li>').prependTo('ul');
```

## DOM Insertion - Outside

### after(content)
Insert after elements.
```javascript
$('div').after('<p>After</p>');
```

### before(content)
Insert before elements.
```javascript
$('div').before('<p>Before</p>');
```

### insertAfter(target)
Insert elements after target.
```javascript
$('<p>After</p>').insertAfter('div');
```

### insertBefore(target)
Insert elements before target.
```javascript
$('<p>Before</p>').insertBefore('div');
```

## DOM Insertion - Wrapping

### wrap(wrappingElement)
Wrap each element.
```javascript
$('span').wrap('<div class="wrapper"></div>');
```

### wrapAll(wrappingElement)
Wrap all elements together.
```javascript
$('span').wrapAll('<div class="container"></div>');
```

### wrapInner(wrappingElement)
Wrap content of each element.
```javascript
$('div').wrapInner('<span class="inner"></span>');
```

## DOM Removal

### remove([selector])
Remove elements from DOM.
```javascript
$('.item').remove();
$('div').remove('.delete');
```

## Miscellaneous

### get([index])
Get DOM element(s).
```javascript
$('div').get(0); // First DOM element
$('div').get(); // Array of all
```

### toArray()
Convert to plain array.
```javascript
const divs = $('div').toArray();
```

### size()
Get number of elements.
```javascript
$('div').size(); // Same as .length
```

### index([element | selector])
Get element index.
```javascript
$('li').eq(2).index(); // 2
```

### position()
Get position relative to parent.
```javascript
$('div').position(); // {top: 0, left: 0}
```

## jqnode-Specific

### table2json([options])
Convert table to JSON.
```javascript
$('table').table2json();
$('table').table2json({ ignoreColumns: [0] });
```

### findTableWithHeader(headers)
Find tables by headers.
```javascript
$('body').findTableWithHeader('Name');
$('body').findTableWithHeader(['Name', 'Email']);
```

### title()
Get document title.
```javascript
$('html').title(); // "Page Title"
```

## Chaining Example

```javascript
$('div')
    .addClass('container')
    .find('p')
    .addClass('paragraph')
    .filter('.active')
    .text('Updated')
    .end()
    .end()
    .attr('data-processed', 'true');
```

## Common Patterns

### Toggle visibility
```javascript
$('.menu').toggleClass('hidden');
```

### Form validation
```javascript
$('input').each(function() {
    if (!$(this).val()) {
        $(this).addClass('error');
    }
});
```

### Build list
```javascript
const data = ['A', 'B', 'C'];
data.forEach(item => {
   $('ul').append(`<li>${item}</li>`);
});
```

### Extract data
```javascript
const items = $('li').map(function() {
    return $(this).text();
}).get();
```

### Conditional styling
```javascript
$('div').each(function() {
    if ($(this).data('priority') === 'high') {
        $(this).addClass('important');
    }
});
```

---

For detailed documentation with more examples, see individual method files in `/docs/`.
