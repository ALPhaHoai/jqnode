import $ from '../index';

console.log('=== jqnode CSS Method Examples ===\n');

// Sample HTML
const html = `
<div class="container" style="padding: 20px">
    <h1 id="title" style="color: blue; font-size: 24px">CSS Method Demo</h1>
    <div class="box" style="width: 100px; height: 100px; background-color: red">Box 1</div>
    <div class="box" style="width: 150px; height: 150px; background-color: green">Box 2</div>
    <div class="box" style="width: 200px; height: 200px; background-color: blue">Box 3</div>
    <p style="font-family: Arial; line-height: 1.5">Some paragraph text</p>
</div>
`;

const root = $(html);

// EXAMPLE 1: Getting single CSS property
console.log('=== Example 1: Getting Single CSS Property ===');
const title = root.find('#title');
console.log('Title color:', title.css('color'));
console.log('Title font-size:', title.css('font-size'));
console.log('Title fontSize (camelCase):', title.css('fontSize'));

// EXAMPLE 2: Getting multiple CSS properties
console.log('\n=== Example 2: Getting Multiple CSS Properties ===');
const firstBox = root.find('.box').first();
const boxStyles = firstBox.css(['width', 'height', 'background-color']);
console.log('Box styles:', boxStyles);

// EXAMPLE 3: Setting single CSS property
console.log('\n=== Example 3: Setting Single CSS Property ===');
title.css('color', 'purple');
console.log('New title color:', title.css('color'));

// EXAMPLE 4: Setting with numeric values (auto px conversion)
console.log('\n=== Example 4: Setting with Numeric Values ===');
firstBox.css('width', 250);
console.log('New box width:', firstBox.css('width'));

firstBox.css('margin', 10);
console.log('New box margin:', firstBox.css('margin'));

// EXAMPLE 5: Setting multiple properties with object
console.log('\n=== Example 5: Setting Multiple Properties ===');
const paragraph = root.find('p');
paragraph.css({
    color: '#333',
    fontSize: '16px',
    padding: '10px',
    border: '1px solid #ccc'
});

const pStyles = paragraph.css(['color', 'font-size', 'padding', 'border']);
console.log('Paragraph styles:', pStyles);

// EXAMPLE 6: Setting with callback function
console.log('\n=== Example 6: Setting with Callback Function ===');
const boxes = root.find('.box');
console.log('Original box widths:');
boxes.each(function (i, box) {
    console.log(`  Box ${i + 1}:`, $(box).css('width'));
});

// Increase each box width by 50px
boxes.css('width', function (index, currentValue) {
    const current = parseInt(currentValue);
    return (current + 50) + 'px';
});

console.log('New box widths (after +50px):');
boxes.each(function (i, box) {
    console.log(`  Box ${i + 1}:`, $(box).css('width'));
});

// EXAMPLE 7: Chaining css() with other methods
console.log('\n=== Example 7: Method Chaining ===');
root.find('.box')
    .first()
    .css('border', '3px solid black')
    .css('border-radius', '10px')
    .css({
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: 'scale(1.1)'
    });

console.log('First box after chaining:', root.find('.box').first().css(['border', 'border-radius']));

// EXAMPLE 8: Working with colors
console.log('\n=== Example 8: Working with Colors ===');
const secondBox = boxes.eq(1);
secondBox.css('background-color', '#ff6600'); // Hex
secondBox.css('border-color', 'rgb(0, 0, 255)'); // RGB
console.log('Second box background:', secondBox.css('background-color'));
console.log('Second box border:', secondBox.css('border-color'));

// EXAMPLE 9: Positioning
console.log('\n=== Example 9: Positioning ===');
const container = root.find('.container');
container.css({
    position: 'relative',
    top: 20,
    left: 30,
    width: 500,
    maxWidth: '100%'
});

console.log('Container position:', container.css('position'));
console.log('Container top:', container.css('top'));
console.log('Container width:', container.css('width'));

// EXAMPLE 10: Opacity and visibility
console.log('\n=== Example 10: Opacity and Visibility ===');
const lastBox = boxes.last();
lastBox.css('opacity', 0.5);
console.log('Last box opacity:', lastBox.css('opacity'));

// Hide an element
lastBox.css('display', 'none');
console.log('Last box display:', lastBox.css('display'));

// Show it again
lastBox.css('display', 'block');
console.log('Last box display (shown):', lastBox.css('display'));

// EXAMPLE 11: Typography
console.log('\n=== Example 11: Typography ===');
title.css({
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px'
});

const titleTypography = title.css(['font-family', 'font-weight', 'font-size']);
console.log('Title typography:', titleTypography);

// EXAMPLE 12: Empty selection (edge case)
console.log('\n=== Example 12: Empty Selection ===');
const missing = root.find('.nonexistent');
console.log('CSS from empty selection:', missing.css('color')); // undefined
missing.css('color', 'red'); // No error, just no effect
console.log('Length of missing elements:', missing.length);

// EXAMPLE 13: Responsive design helpers
console.log('\n=== Example 13: Responsive Design ===');
container.css({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box'
});

console.log('Container responsive styles:', container.css(['max-width', 'margin', 'box-sizing']));

// EXAMPLE 14: Flexbox
console.log('\n=== Example 14: Flexbox Layout ===');
container.css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px'
});

console.log('Container flex styles:', container.css(['display', 'flex-direction', 'justify-content']));

// EXAMPLE 15: Advanced - Dynamic styling based on index
console.log('\n=== Example 15: Dynamic Styling Based on Index ===');
boxes.css('opacity', function (index) {
    return 1 - (index * 0.2); // Gradually fade boxes
});

boxes.each(function (i, box) {
    console.log(`  Box ${i + 1} opacity:`, $(box).css('opacity'));
});

console.log('\n=== All Examples Completed ===');
