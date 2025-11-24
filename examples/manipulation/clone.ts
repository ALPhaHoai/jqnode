/**
 * Example demonstrating the .clone() method
 * Based on jQuery API documentation: https://api.jquery.com/clone/
 */

import jq from '../../index';

console.log('jQuery .clone() Method Examples\n');
console.log('='.repeat(60));

// Example 1: Basic cloning
console.log('\n📝 Example 1: Basic HTML Element Cloning');
console.log('-'.repeat(60));

const $hello = jq('<div class="hello">Hello</div>');
const $cloned = $hello.clone();

console.log('Original HTML:', $hello.html());
console.log('Cloned HTML:  ', $cloned.html());
console.log('Are they different objects?', $hello.nodes[0] !== $cloned.nodes[0]);

// Example 2: Clone and append (common jQuery pattern)
console.log('\n📝 Example 2: Clone and Append Pattern');
console.log('-'.repeat(60));
console.log('This demonstrates how .clone() prevents moving elements\n');

// Without clone - element gets moved
const $container1 = jq.load(`
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">Goodbye</div>
</div>
`);

console.log('Before append (without clone):');
console.log($container1('.container').html());

$container1('.hello').appendTo($container1('.goodbye'));

console.log('\nAfter append (without clone) - element moved:');
console.log($container1('.container').html());

// With clone - element gets copied
const $container2 = jq.load(`
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">Goodbye</div>
</div>
`);

console.log('\nBefore clone + append:');
console.log($container2('.container').html());

$container2('.hello').clone().appendTo($container2('.goodbye'));

console.log('\nAfter clone + append - element duplicated:');
console.log($container2('.container').html());

// Example 3: Cloning preserves structure and attributes
console.log('\n📝 Example 3: Cloning Preserves Structure and Attributes');
console.log('-'.repeat(60));

const $complex = jq(
    '<div id="main" class="wrapper"><h1>Title</h1><p class="text">Content</p></div>',
);
const $copy = $complex.clone();

console.log('Original element:');
console.log('  ID:', $complex.attr('id'));
console.log('  Class:', $complex.attr('class'));
console.log('  HTML:', $complex.html());

console.log('\nCloned element:');
console.log('  ID:', $copy.attr('id'));
console.log('  Class:', $copy.attr('class'));
console.log('  HTML:', $copy.html());

// Example 4: Clone with data
console.log('\n📝 Example 4: Cloning with Data');
console.log('-'.repeat(60));

const $button = jq('<button>Click me</button>');
$button.data('clickCount', 5);
$button.data('userId', 'user123');

console.log('Original button data:');
console.log('  clickCount:', $button.data('clickCount'));
console.log('  userId:', $button.data('userId'));

const $btnCloneNoData = $button.clone();
console.log('\nClone WITHOUT data (default):');
console.log('  clickCount:', $btnCloneNoData.data('clickCount'));
console.log('  userId:', $btnCloneNoData.data('userId'));

const $btnCloneWithData = $button.clone(true);
console.log('\nClone WITH data (withDataAndEvents=true):');
console.log('  clickCount:', $btnCloneWithData.data('clickCount'));
console.log('  userId:', $btnCloneWithData.data('userId'));

// Example 5: Modifying clones doesn't affect originals
console.log('\n📝 Example 5: Clones are Independent');
console.log('-'.repeat(60));

const $original = jq('<div><span>Original Text</span></div>');
const $modified = $original.clone();

$modified.find('span').text('Modified Text');
$modified.attr('class', 'modified');

console.log('Original after modification:');
console.log('  Text:', $original.find('span').text());
console.log('  Class:', $original.attr('class'));

console.log('\nClone after modification:');
console.log('  Text:', $modified.find('span').text());
console.log('  Class:', $modified.attr('class'));

// Example 6: Cloning multiple elements
console.log('\n📝 Example 6: Cloning Multiple Elements');
console.log('-'.repeat(60));

const $list = jq.load('<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
const $items = $list('li');
const $itemsClone = $items.clone();

console.log('Original items count:', $items.length);
console.log('Cloned items count:', $itemsClone.length);

console.log('\nOriginal items text:');
$items.each(function (i) {
    console.log(`  ${i + 1}. ${jq(this).text()}`);
});

console.log('\nCloned items text:');
$itemsClone.each(function (i) {
    console.log(`  ${i + 1}. ${jq(this).text()}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ All examples completed successfully!');
console.log('='.repeat(60));
