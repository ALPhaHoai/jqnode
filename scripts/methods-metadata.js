const fs = require('fs');
const path = require('path');

// Method metadata
const methodsData = {
    // Content methods
    html: {
        category: 'Content',
        desc: 'Get or set the HTML content of elements',
        params: '[htmlString]',
        returns: 'String (get) | JQ instance (set)'
    },
    text: {
        category: 'Content',
        desc: 'Get or set the text content of elements',
        params: '[textString]',
        returns: 'String (get) | JQ instance (set)'
    },

    // Attribute methods
    removeClass: {
        category: 'Attributes',
        desc: 'Remove one or more classes from elements',
        params: 'className | function',
        returns: 'JQ instance'
    },
    toggleClass: {
        category: 'Attributes',
        desc: 'Toggle one or more classes on elements',
        params: 'className [, state]',
        returns: 'JQ instance'
    },
    hasClass: {
        category: 'Attributes',
        desc: 'Check if any element has a specific class',
        params: 'className',
        returns: 'Boolean'
    },
    prop: {
        category: 'Attributes',
        desc: 'Get or set a property value on elements',
        params: 'propertyName [, value]',
        returns: 'Any (get) | JQ instance (set)'
    },
    val: {
        category: 'Attributes',
        desc: 'Get or set the value of form elements',
        params: '[value]',
        returns: 'String/Array (get) | JQ instance (set)'
    },
    removeAttr: {
        category: 'Attributes',
        desc: 'Remove an attribute from elements',
        params: 'attributeName',
        returns: 'JQ instance'
    },
    removeProp: {
        category: 'Attributes',
        desc: 'Remove a property from elements',
        params: 'propertyName',
        returns: 'JQ instance'
    },

    // Data methods
    removeData: {
        category: 'Data',
        desc: 'Remove stored data from elements',
        params: '[key]',
        returns: 'JQ instance'
    },

    // Iteration methods
    map: {
        category: 'Iteration',
        desc: 'Pass each element through a function and return a new array',
        params: 'function(index, element)',
        returns: 'JQ instance (array-like)'
    },

    // Filtering methods
    filter: {
        category: 'Filtering',
        desc: 'Reduce the set of matched elements to those that match the selector or pass the function test',
        params: 'selector | function',
        returns: 'JQ instance'
    },
    eq: {
        category: 'Filtering',
        desc: 'Reduce the set of matched elements to the one at the specified index',
        params: 'index',
        returns: 'JQ instance'
    },
    first: {
        category: 'Filtering',
        desc: 'Reduce the set of matched elements to the first one',
        params: '',
        returns: 'JQ instance'
    },
    last: {
        category: 'Filtering',
        desc: 'Reduce the set of matched elements to the last one',
        params: '',
        returns: 'JQ instance'
    },
    has: {
        category: 'Filtering',
        desc: 'Reduce the set to elements that have a descendant matching the selector',
        params: 'selector',
        returns: 'JQ instance'
    },
    is: {
        category: 'Filtering',
        desc: 'Check if any element matches the selector',
        params: 'selector',
        returns: 'Boolean'
    },
    not: {
        category: 'Filtering',
        desc: 'Remove elements from the set that match the selector',
        params: 'selector | function',
        returns: 'JQ instance'
    },
    slice: {
        category: 'Filtering',
        desc: 'Reduce the set of matched elements to a subset specified by a range of indices',
        params: 'start [, end]',
        returns: 'JQ instance'
    },

    // Traversal - Parents
    parent: {
        category: 'Traversal',
        desc: 'Get the immediate parent of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    parents: {
        category: 'Traversal',
        desc: 'Get all ancestors of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    closest: {
        category: 'Traversal',
        desc: 'Get the first ancestor that matches the selector',
        params: 'selector',
        returns: 'JQ instance'
    },
    parentsUntil: {
        category: 'Traversal',
        desc: 'Get ancestors until (but not including) the element matched by selector',
        params: 'selector [, filter]',
        returns: 'JQ instance'
    },

    // Traversal - Children
    children: {
        category: 'Traversal',
        desc: 'Get the immediate children of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    find: {
        category: 'Traversal',
        desc: 'Get descendants of each element matching the selector',
        params: 'selector',
        returns: 'JQ instance'
    },
    contents: {
        category: 'Traversal',
        desc: 'Get the children including text and comment nodes',
        params: '',
        returns: 'JQ instance'
    },

    // Traversal - Siblings
    siblings: {
        category: 'Traversal',
        desc: 'Get all siblings of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    next: {
        category: 'Traversal',
        desc: 'Get the immediately following sibling of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    nextAll: {
        category: 'Traversal',
        desc: 'Get all following siblings of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    nextUntil: {
        category: 'Traversal',
        desc: 'Get following siblings until (but not including) the element matched by selector',
        params: 'selector [, filter]',
        returns: 'JQ instance'
    },
    prev: {
        category: 'Traversal',
        desc: 'Get the immediately preceding sibling of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    prevAll: {
        category: 'Traversal',
        desc: 'Get all preceding siblings of each element',
        params: '[selector]',
        returns: 'JQ instance'
    },
    prevUntil: {
        category: 'Traversal',
        desc: 'Get preceding siblings until (but not including) the element matched by selector',
        params: 'selector [, filter]',
        returns: 'JQ instance'
    },
    end: {
        category: 'Traversal',
        desc: 'End the most recent filtering operation and return to the previous set',
        params: '',
        returns: 'JQ instance'
    },

    // Insertion methods
    append: {
        category: 'Insertion',
        desc: 'Insert content at the end of each element',
        params: 'content',
        returns: 'JQ instance'
    },
    appendTo: {
        category: 'Insertion',
        desc: 'Insert elements at the end of target',
        params: 'target',
        returns: 'JQ instance'
    },
    prepend: {
        category: 'Insertion',
        desc: 'Insert content at the beginning of each element',
        params: 'content',
        returns: 'JQ instance'
    },
    prependTo: {
        category: 'Insertion',
        desc: 'Insert elements at the beginning of target',
        params: 'target',
        returns: 'JQ instance'
    },
    after: {
        category: 'Insertion',
        desc: 'Insert content after each element',
        params: 'content',
        returns: 'JQ instance'
    },
    before: {
        category: 'Insertion',
        desc: 'Insert content before each element',
        params: 'content',
        returns: 'JQ instance'
    },
    insertAfter: {
        category: 'Insertion',
        desc: 'Insert elements after target',
        params: 'target',
        returns: 'JQ instance'
    },
    insertBefore: {
        category: 'Insertion',
        desc: 'Insert elements before target',
        params: 'target',
        returns: 'JQ instance'
    },
    wrap: {
        category: 'Insertion',
        desc: 'Wrap an HTML structure around each element',
        params: 'wrappingElement',
        returns: 'JQ instance'
    },
    wrapAll: {
        category: 'Insertion',
        desc: 'Wrap an HTML structure around all elements',
        params: 'wrappingElement',
        returns: 'JQ instance'
    },
    wrapInner: {
        category: 'Insertion',
        desc: 'Wrap an HTML structure around the content of each element',
        params: 'wrappingElement',
        returns: 'JQ instance'
    },

    // Miscellaneous
    get: {
        category: 'Miscellaneous',
        desc: 'Retrieve the DOM element at the specified index',
        params: '[index]',
        returns: 'Element | Array'
    },
    toArray: {
        category: 'Miscellaneous',
        desc: 'Convert the set of matched elements to an array',
        params: '',
        returns: 'Array'
    },
    size: {
        category: 'Miscellaneous',
        desc: 'Get the number of elements in the jQuery object',
        params: '',
        returns: 'Number'
    },
    index: {
        category: 'Miscellaneous',
        desc: 'Get the index of the element relative to its siblings or selector',
        params: '[element | selector]',
        returns: 'Number'
    },
    position: {
        category: 'Miscellaneous',
        desc: 'Get the position of the element relative to its offset parent',
        params: '',
        returns: 'Object {top, left}'
    },
    remove: {
        category: 'Miscellaneous',
        desc: 'Remove the set of matched elements from the DOM',
        params: '[selector]',
        returns: 'JQ instance'
    }
};

// Generate summary
const byCategory = {};
Object.entries(methodsData).forEach(([method, data]) => {
    if (!byCategory[data.category]) byCategory[data.category] = [];
    byCategory[data.category].push(method);
});

console.log('\n📊 Methods to Document:\n');
let total = 0;
Object.entries(byCategory).forEach(([category, methods]) => {
    console.log(`${category}Methods (${methods.length}):`);
    console.log(`  ${methods.join(', ')}`);
    total += methods.length;
});

console.log(`\nTotal: ${total} methods\n`);

// Save metadata for generator script
fs.writeFileSync(
    path.join(__dirname, 'methods-metadata.json'),
    JSON.stringify(methodsData, null, 2)
);

console.log('✅ Metadata saved to methods-metadata.json\n');
