// Utility function to generate and display code examples
function generateCodeExample(sectionId, code) {
    const codeElement = document.querySelector(`#${sectionId} .language-javascript`);
    if (codeElement) {
        codeElement.textContent = code;
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    }
}

// Initialize code examples on page load
document.addEventListener('DOMContentLoaded', function () {
    // Generate code examples for all demo sections using actual demo functions
    generateCodeExample('html-parsing', demoSimpleHTMLParsing.toString());

    generateCodeExample('dom-traversal', demoTraversal.toString());

    generateCodeExample('content-manipulation', demoContent.toString());

    generateCodeExample('attributes-classes', demoAttributes.toString());

    generateCodeExample('element-insertion', demoInsertion.toString());

    generateCodeExample('filtering-iteration', demoFiltering.toString());

    generateCodeExample('method-chaining', demoChaining.toString());

    generateCodeExample('advanced-features', demoAdvanced.toString());
});

// Demo Functions
function demoSimpleHTMLParsing() {
    // Parse HTML string and create jQuery-like object
    const $root = $('<div><h1>Hello</h1><p>World</p></div>');

    // Find elements using CSS selectors
    const $title = $root.find('h1');
    const $items = $root.find('p');

    // Output results
    console.log('Title:', $title.text());
    console.log('Items count:', $items.length);

    const result = {
        title: $title.text(),
        itemsCount: $items.length,
    };

    document.getElementById('parsing-result').innerHTML = `
        <strong>Simple HTML Parsing Example:</strong><br>
        <strong>Title:</strong> ${result.title}<br>
        <strong>Paragraph count:</strong> ${result.itemsCount}
    `;

    console.log('Simple HTML Parsing Demo Result:', result);
    return result;
}

function demoHTMLParsing() {
    const html = `<div class="container">
            <h1 class="title">Welcome to jqnode</h1>
            <p class="intro">This is a demo of the library's features.</p>
            <ul class="features">
                <li>DOM Traversal</li>
                <li>CSS Selectors</li>
                <li>HTML Manipulation</li>
                <li>Method Chaining</li>
            </ul>
            <input type="text" id="demo-input" value="Hello World">
        </div>`;

    const $root = $(html);

    const $title = $root.find('.title');
    const $items = $root.find('li');
    const $input = $root.find('#demo-input');

    const result = {
        rootElements: $root.length,
        title: $title.text(),
        itemsCount: $items.length,
        inputValue: $input.val(),
    };

    document.getElementById('parsing-result').innerHTML = `
        <strong>Root elements:</strong> ${result.rootElements}<br>
        <strong>Title:</strong> ${result.title}<br>
        <strong>List items:</strong> ${result.itemsCount}<br>
        <strong>Input value:</strong> ${result.inputValue}
    `;

    console.log('HTML Parsing Demo Result:', result);
    return result;
}

function demoTraversal() {
    const html = `<div class="container">
            <h1>Parent Element</h1>
            <div class="child first">First Child</div>
            <div class="child middle">
                <span>Middle Child Span</span>
            </div>
            <div class="child last">Last Child</div>
        </div>`;

    const $container = $(html);

    const result = {
        children: $container.children().length,
        firstChild: $container.children().first().text(),
        lastChild: $container.children().last().text(),
        findSpan: $container.find('span').text(),
        siblings: $container.children().first().siblings().length,
    };

    document.getElementById('traversal-result').innerHTML = `
        <strong>Children count:</strong> ${result.children}<br>
        <strong>First child:</strong> ${result.firstChild}<br>
        <strong>Last child:</strong> ${result.lastChild}<br>
        <strong>Found span:</strong> ${result.findSpan}<br>
        <strong>Siblings of first:</strong> ${result.siblings}
    `;

    console.log('Traversal Demo Result:', result);
    return result;
}

function demoContent() {
    const html = `<div class="content-demo">
            <p>Original text content</p>
            <input type="text" value="input value">
        </div>`;

    const $demo = $(html);
    const $p = $demo.find('p');
    const $input = $demo.find('input');

    const originalText = $p.text();
    const originalValue = $input.val();

    $p.text('Updated text content');
    $input.val('new input value');

    const result = {
        originalText,
        originalValue,
        newText: $p.text(),
        newValue: $input.val(),
    };

    document.getElementById('content-result').innerHTML = `
        <strong>Original text:</strong> ${result.originalText}<br>
        <strong>New text:</strong> ${result.newText}<br>
        <strong>Original value:</strong> ${result.originalValue}<br>
        <strong>New value:</strong> ${result.newValue}
    `;

    console.log('Content Demo Result:', result);
    return result;
}

function demoAttributes() {
    const html = `<div class="attr-demo" data-id="123">
            <button class="btn active">Click me</button>
        </div>`;

    const $demo = $(html);
    const $btn = $demo.find('button');

    const result = {
        dataId: $demo.attr('data-id'),
        hasActive: $btn.hasClass('active'),
        classes: $btn.attr('class'),
    };

    $demo.attr('data-id', '456');
    $btn.addClass('highlight').removeClass('active');

    result.newDataId = $demo.attr('data-id');
    result.newClasses = $btn.attr('class');

    document.getElementById('attributes-result').innerHTML = `
        <strong>Original data-id:</strong> ${result.dataId}<br>
        <strong>Has 'active' class:</strong> ${result.hasActive}<br>
        <strong>Original classes:</strong> ${result.classes}<br>
        <strong>New data-id:</strong> ${result.newDataId}<br>
        <strong>New classes:</strong> ${result.newClasses}
    `;

    console.log('Attributes Demo Result:', result);
    return result;
}

function demoInsertion() {
    const html = `<div class="insertion-demo">
            <p>Original content</p>
        </div>`;

    const $demo = $(html);
    const $p = $demo.find('p');

    $p.append('<strong> appended</strong>');
    $p.prepend('<em>prepended </em>');
    $p.before('<div>Before paragraph</div>');
    $p.after('<div>After paragraph</div>');

    const result = {
        finalHTML: $demo.html(),
    };

    document.getElementById('insertion-result').innerHTML = `
        <strong>Final HTML:</strong><br>
        <pre>${result.finalHTML}</pre>
    `;

    console.log('Insertion Demo Result:', result);
    return result;
}

function demoFiltering() {
    const html = `<ul class="filter-demo">
            <li class="active">Active item 1</li>
            <li>Normal item</li>
            <li class="active">Active item 2</li>
            <li>Normal item 2</li>
        </ul>`;

    const $list = $(html);
    const $items = $list.find('li');

    const result = {
        totalItems: $items.length,
        activeItems: $items.filter('.active').length,
        visibleItems: $items.filter(':visible').length,
        firstItem: $items.first().text(),
        lastItem: $items.last().text(),
    };

    document.getElementById('filtering-result').innerHTML = `
        <strong>Total items:</strong> ${result.totalItems}<br>
        <strong>Active items:</strong> ${result.activeItems}<br>
        <strong>Visible items:</strong> ${result.visibleItems}<br>
        <strong>First item:</strong> ${result.firstItem}<br>
        <strong>Last item:</strong> ${result.lastItem}
    `;

    console.log('Filtering Demo Result:', result);
    return result;
}

function demoChaining() {
    const html = `<div class="chaining-demo">
            <ul>
                <li class="item active">Item 1</li>
                <li class="item">Item 2</li>
                <li class="item active">Item 3</li>
            </ul>
        </div>`;

    const $demo = $(html);

    // Simple method chaining
    $demo
        .find('li.active') // Find active items
        .addClass('highlight') // Add highlight class
        .text('Updated'); // Change text

    // Add attribute to the ul element separately
    $demo.find('ul').attr('data-processed', 'true');

    const processedItems = $demo.find('li.active').length;
    const hasProcessed = $demo.find('ul').attr('data-processed') === 'true';

    const demoResult = {
        processedItems,
        hasProcessed,
        finalHTML: $demo.html(),
    };

    document.getElementById('chaining-result').innerHTML = `
        <strong>Processed items:</strong> ${demoResult.processedItems}<br>
        <strong>Data processed:</strong> ${demoResult.hasProcessed}<br>
        <strong>Final structure:</strong> ${demoResult.finalHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    `;

    console.log('Chaining Demo Result:', demoResult);
    return demoResult;
}

function demoAdvanced() {
    // Test utility functions
    const array = [1, 2, 3, 4, 5];

    const mapped = $.map(array, function (value) {
        return value * 2;
    });

    const eachResult = [];
    $.each(array, function (index, value) {
        eachResult.push(`${index}:${value}`);
    });

    const result = {
        original: array,
        mapped: mapped,
        eachResult: eachResult.join(', '),
    };

    document.getElementById('advanced-result').innerHTML = `
        <strong>Original array:</strong> [${result.original.join(', ')}]<br>
        <strong>Mapped (doubled):</strong> [${result.mapped.join(', ')}]<br>
        <strong>Each iteration:</strong> ${result.eachResult}
    `;

    console.log('Advanced Demo Result:', result);
    return result;
}

// Manual testing functions
function runIndividualTests() {
    // Run a subset of tests or individual test functions
    console.log('Running individual demo functions...');

    const results = [];
    const testFunctions = [
        { name: 'Simple HTML Parsing', func: demoSimpleHTMLParsing },
        { name: 'HTML Parsing', func: demoHTMLParsing },
        { name: 'DOM Traversal', func: demoTraversal },
        { name: 'Content Manipulation', func: demoContent },
        { name: 'Attributes & Classes', func: demoAttributes },
        { name: 'Element Insertion', func: demoInsertion },
        { name: 'Filtering & Iteration', func: demoFiltering },
        { name: 'Method Chaining', func: demoChaining },
        { name: 'Advanced Features', func: demoAdvanced },
    ];

    testFunctions.forEach(function (test) {
        try {
            const result = test.func();
            results.push(`✅ ${test.name}: PASSED`);
            console.log(`${test.name} result:`, result);
        } catch (error) {
            results.push(`❌ ${test.name}: FAILED - ${error.message}`);
            console.error(`${test.name} error:`, error);
        }
    });

    document.getElementById('test-results').innerHTML = `
        <strong>Individual Test Results:</strong><br>
        ${results.join('<br>')}
    `;
}
