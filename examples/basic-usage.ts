import $ from '../index';
import type { JqElement } from '../types';

console.log('=== jqnode Debug Logging Example ===\n');

// Sample HTML
const html = `
<div class="container">
    <h1 class="title">Welcome to jqnode</h1>
    <p class="intro">This is a jQuery-like library for Node.js</p>
    <div class="features">
        <div class="feature">DOM Traversal</div>
        <div class="feature">CSS Selectors</div>
        <div class="feature">HTML Manipulation</div>
    </div>
</div>
`;

console.log('Parsing HTML and performing operations...\n');

// Create jQuery-like object
const root = $(html);

// Find elements
const title = root.find('.title');
const features = root.find('.feature');

// Get text content
console.log('Title text:', title.text());
console.log('Number of features:', features.nodes.length);

// Demonstrate chaining
const firstFeature = features.first();
console.log('First feature:', firstFeature.text());

// Iterate through elements
console.log('\n=== Iteration Examples ===');
features.each(function (this: JqElement, index: number, elem: JqElement) {
    console.log(`Feature ${index + 1}:`, $(elem).text());
});

// Map elements
const featureTexts = features
    .map(function (this: JqElement, index: number, elem: JqElement): string {
        return $(elem).text().toUpperCase();
    })
    .get();
console.log('Uppercase features:', featureTexts);

// Attribute manipulation
console.log('\n=== Attribute Manipulation ===');
root.find('h1').attr('id', 'main-title');
console.log('Title ID:', root.find('h1').attr('id'));
console.log('Has data-info attribute?', root.find('h1').attr('data-info') !== undefined);

// Class manipulation
console.log('\n=== Class Manipulation ===');
const intro = root.find('.intro');
intro.addClass('highlighted');
console.log('Has highlighted class?', intro.hasClass('highlighted'));
intro.removeClass('highlighted');
console.log('After remove - has highlighted class?', intro.hasClass('highlighted'));
intro.toggleClass('active');
console.log('After toggle - has active class?', intro.hasClass('active'));

// HTML and Text manipulation
console.log('\n=== HTML & Text Manipulation ===');
const container = root.find('.container');
console.log('Original HTML length:', container.html().length);
const newFeature = $('<div class="feature">Server-Side Rendering</div>');
container.find('.features').append(newFeature);
console.log('After append - feature count:', container.find('.feature').length);

// Traversal methods
console.log('\n=== Traversal Methods ===');
const featureDiv = root.find('.feature').first();
console.log('Parent class:', featureDiv.parent().attr('class'));
console.log('Siblings count:', featureDiv.siblings().length);
console.log('Closest container class:', featureDiv.closest('.container').find('h1').text());

// Data methods
console.log('\n=== Data Methods ===');
const titleEl = root.find('.title');
titleEl.data('section', 'header');
titleEl.data('priority', 1);
console.log('Section data:', titleEl.data('section'));
console.log('Priority data:', titleEl.data('priority'));
console.log('All data:', titleEl.data());

// Filtering methods
console.log('\n=== Filtering Methods ===');
const allDivs = root.find('div');
console.log('All divs:', allDivs.length);
const notFeatures = allDivs.not('.feature');
console.log('Divs that are not features:', notFeatures.length);
const firstTwo = allDivs.slice(0, 2);
console.log('First two divs:', firstTwo.length);
const thirdDiv = allDivs.eq(2);
console.log('Third div class:', thirdDiv.attr('class'));

// Complex chaining example
console.log('\n=== Complex Chaining Example ===');
const result = root.find('.features').children().filter('.feature').addClass('item').first().text();
console.log('Chained result:', result);

// Array conversion
console.log('\n=== Array Conversion ===');
const featuresArray = features.toArray();
console.log('Features as array length:', featuresArray.length);
console.log('Is array?', Array.isArray(featuresArray));

// Note: More methods like clone(), wrap(), etc. are coming soon!

console.log('\n=== Debug logs are disabled by default ===');
console.log('To enable debug logs, set environment variable:');
console.log('  JQNODE_DEBUG=1 node examples/basic-usage.js');
console.log('  or');
console.log('  DEBUG=jqnode node examples/basic-usage.js');
