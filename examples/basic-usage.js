const $ = require('../index');

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

console.log('\n=== Debug logs are disabled by default ===');
console.log('To enable debug logs, set environment variable:');
console.log('  JQNODE_DEBUG=1 node examples/basic-usage.js');
console.log('  or');
console.log('  DEBUG=jqnode node examples/basic-usage.js');
