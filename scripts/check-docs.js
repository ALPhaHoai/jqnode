const fs = require('fs');
const path = require('path');

// Mapping of categories to their folder names in docs/
const categoryFolders = {
    'content': 'content',
    'attributes': 'attributes',
    'data': 'data',
    'iteration': 'iteration',
    'filtering': 'filtering',
    'traversal-ancestor': 'traversal',
    'traversal-descendant': 'traversal',
    'traversal-sibling': 'traversal',
    'traversal-other': 'traversal',
    'insertion-inside': 'insertion',
    'insertion-outside': 'insertion',
    'insertion-wrapping': 'insertion',
    'miscellaneous': 'miscellaneous'
};

// List of all methods that need documentation
const methods = {
    'content': ['html', 'text', 'table2json', 'findTableWithHeader', 'title'],
    'attributes': ['addClass', 'removeClass', 'toggleClass', 'hasClass', 'attr', 'prop', 'removeAttr', 'removeProp', 'val'],
    'data': ['data', 'removeData'],
    'iteration': ['each', 'map'],
    'filtering': ['filter', 'eq', 'first', 'last', 'has', 'is', 'not', 'slice'],
    'traversal-ancestor': ['parent', 'parents', 'closest', 'parentsUntil'],
    'traversal-descendant': ['children', 'find', 'contents'],
    'traversal-sibling': ['siblings', 'next', 'nextAll', 'nextUntil', 'prev', 'prevAll', 'prevUntil'],
    'traversal-other': ['end'],
    'insertion-inside': ['append', 'appendTo', 'prepend', 'prependTo'],
    'insertion-outside': ['after', 'before', 'insertAfter', 'insertBefore'],
    'insertion-wrapping': ['wrap', 'wrapAll', 'wrapInner'],
    'miscellaneous': ['get', 'toArray', 'size', 'index', 'position', 'remove']
};

// Count total methods
let total = 0;
Object.values(methods).forEach(arr => total += arr.length);

console.log(`\n📚 jqnode Documentation Status\n`);
console.log(`Total methods to document: ${total}\n`);

let documentedCount = 0;
let withExamplesCount = 0;

Object.entries(methods).forEach(([category, methodList]) => {
    const folder = categoryFolders[category];
    console.log(`${category}:`);

    methodList.forEach(method => {
        // Check for docs in category folder
        const docPath = path.join(__dirname, '..', 'docs', folder, `${method}.md`);
        // Special case for title-method.md and first-last.md
        const altDocPath = path.join(__dirname, '..', 'docs', folder, `${method}-method.md`);
        const altDocPath2 = path.join(__dirname, '..', 'docs', folder,
            method === 'first' || method === 'last' ? 'first-last.md' :
                method === 'next' || method === 'prev' ? 'next-prev.md' : `${method}.md`);

        const examplePath = path.join(__dirname, '..', 'examples', `${method}-usage.js`);

        const hasDoc = fs.existsSync(docPath) || fs.existsSync(altDocPath) || fs.existsSync(altDocPath2);
        const hasExample = fs.existsSync(examplePath);

        if (hasDoc) documentedCount++;
        if (hasDoc && hasExample) withExamplesCount++;

        const status = hasDoc && hasExample ? '✅' : hasDoc ? '📄' : '❌';
        console.log(`  ${status} ${method}`);
    });
    console.log('');
});

console.log('Legend:');
console.log('  ✅ = Has documentation AND examples');
console.log('  📄 = Has documentation only');
console.log('  ❌ = Missing documentation\n');

console.log(`Summary:`);
console.log(`  Documented: ${documentedCount}/${total} (${Math.round(documentedCount / total * 100)}%)`);
console.log(`  With Examples: ${withExamplesCount}/${total} (${Math.round(withExamplesCount / total * 100)}%)`);
console.log(`  Missing: ${total - documentedCount}\n`);
