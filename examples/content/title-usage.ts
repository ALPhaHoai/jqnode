/**
 * Example demonstrating the $.title() static method and .title() instance method
 * 
 * This example shows how to get the document title using jqnode in two ways:
 * 1. Instance method (chained): jq(...).title()
 * 2. Static method: jq.title()
 */

import jq from '../index';

console.log('=== Instance Method Examples (Chained Syntax) ===\n');

// Example 1: Get title from a simple HTML document using chained syntax
console.log('Example 1: Simple HTML document (chained)');
const title1 = jq('<html><head><title>My Website</title></head><body><h1>Welcome</h1></body></html>').title();
console.log('Document title:', title1); // Output: "My Website"

// Example 2: Get title with special characters (chained)
console.log('\nExample 2: Title with special characters (chained)');
const title2 = jq('<html><head><title>Welcome &amp; Hello &lt;World&gt;</title></head></html>').title();
console.log('Document title:', title2); // Output: "Welcome & Hello <World>"

// Example 3: Get title with extra whitespace (chained)
console.log('\nExample 3: Title with whitespace - automatically trimmed (chained)');
const title3 = jq('<html><head><title>  Spaced Out Title  </title></head></html>').title();
console.log('Document title:', title3); // Output: "Spaced Out Title"

// Example 4: No title element (chained)
console.log('\nExample 4: Document without title (chained)');
const title4 = jq('<html><head><meta charset="utf-8"></head><body></body></html>').title();
console.log('Document title:', title4); // Output: ""

// Example 5: Complex nested structure (chained)
console.log('\nExample 5: Complex document structure (chained)');
const title5 = jq(`<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Complex Page Title</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <h1>Content</h1>
    </body>
</html>`).title();
console.log('Document title:', title5); // Output: "Complex Page Title"

// Example 6: Store the JQ instance and call title() later
console.log('\nExample 6: Store instance and call title() later');
const $html = jq('<html><head><title>Stored Instance Title</title></head><body></body></html>');
const title6 = $html.title();
console.log('Document title:', title6); // Output: "Stored Instance Title"

console.log('\n=== Static Method Examples ===\n');

// Clear the registry for the static method examples
jq.clearRootNodesRegistry();

// Example 7: Using static method after parsing HTML
console.log('Example 7: Static method after parsing');
jq('<html><head><title>Static Method Title</title></head><body></body></html>');
const title7 = jq.title();
console.log('Document title:', title7); // Output: "Static Method Title"

console.log('\n✓ All examples completed successfully!');
console.log('\nPreferred usage: Use the instance method (chained) syntax for cleaner code:');
console.log('  const title = jq("<html>...</html>").title();');
