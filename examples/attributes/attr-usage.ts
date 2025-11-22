import jq from '../../index';

console.log('=== attr() Method Examples ===\n');

// Example 1: Getting attributes
console.log('Example 1: Getting Attributes');
const html1 = `
    <div id="container" class="main-content" data-role="primary">
        <a href="https://example.com" target="_blank" rel="noopener">Visit Example</a>
        <img src="logo.png" alt="Company Logo" width="300" height="100">
    </div>
`;
const $1 = jq(html1);

console.log('Container class:', $1('#container').attr('class'));
console.log('Container data-role:', $1('#container').attr('data-role'));
console.log('Link href:', $1('a').attr('href'));
console.log('Link target:', $1('a').attr('target'));
console.log('Link rel:', $1('a').attr('rel'));
console.log('Image src:', $1('img').attr('src'));
console.log('Image alt:', $1('img').attr('alt'));
console.log('Image width:', $1('img').attr('width'));

// Example 2: Setting attributes
console.log('\n\nExample 2: Setting Attributes');
const html2 = `<div id="box">Content</div>`;
const $2 = jq(html2);

$2('#box').attr('class', 'highlighted');
$2('#box').attr('data-status', 'active');
$2('#box').attr('title', 'This is a box');

console.log('Class:', $2('#box').attr('class'));
console.log('Data status:', $2('#box').attr('data-status'));
console.log('Title:', $2('#box').attr('title'));

// Example 3: Setting on multiple elements
console.log('\n\nExample 3: Setting Attributes on Multiple Elements');
const html3 = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
    </ul>
`;
const $3 = jq(html3);

// Set class on all items
$3('li').attr('class', 'list-item');
$3('li').attr('data-type', 'task');

// Verify each item has the attributes
$3('li').each(function (index) {
    const $item = jq(this);
    console.log(`Item ${index + 1} - class: ${$item.attr('class')}, type: ${$item.attr('data-type')}`);
});

// Example 4: Boolean attributes
console.log('\n\nExample 4: Boolean Attributes');
const html4 = `
    <form>
        <input type="checkbox" id="newsletter">
        <input type="text" id="email" value="test@example.com">
        <input type="text" id="username">
        <button type="submit" id="submit-btn">Submit</button>
    </form>
`;
const $4 = jq(html4);

// Set boolean attributes
$4('#newsletter').attr('checked', true);
$4('#email').attr('readonly', true);
$4('#username').attr('required', true);
$4('#submit-btn').attr('disabled', true);

console.log('Newsletter checked:', $4('#newsletter').attr('checked'));
console.log('Email readonly:', $4('#email').attr('readonly'));
console.log('Username required:', $4('#username').attr('required'));
console.log('Submit button disabled:', $4('#submit-btn').attr('disabled'));

// Remove boolean attributes
$4('#submit-btn').attr('disabled', false);
console.log('Submit button disabled after removal:', $4('#submit-btn').attr('disabled'));

// Example 5: Chaining
console.log('\n\nExample 5: Method Chaining');
const html5 = `<div id="profile"></div>`;
const $5 = jq(html5);

$5('#profile')
    .attr('class', 'user-profile')
    .attr('data-user-id', '12345')
    .attr('data-username', 'johndoe')
    .attr('data-role', 'admin')
    .attr('aria-label', 'User Profile Section');

console.log('Class:', $5('#profile').attr('class'));
console.log('User ID:', $5('#profile').attr('data-user-id'));
console.log('Username:', $5('#profile').attr('data-username'));
console.log('Role:', $5('#profile').attr('data-role'));
console.log('ARIA label:', $5('#profile').attr('aria-label'));

// Example 6: ARIA attributes for accessibility
console.log('\n\nExample 6: ARIA Attributes');
const html6 = `
    <nav id="main-nav">
        <button id="menu-toggle">Menu</button>
        <ul id="menu" style="display: none;">
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
`;
const $6 = jq(html6);

$6('#menu-toggle')
    .attr('aria-label', 'Toggle navigation menu')
    .attr('aria-expanded', 'false')
    .attr('aria-controls', 'menu');

$6('#menu')
    .attr('role', 'navigation')
    .attr('aria-hidden', 'true');

console.log('Button aria-label:', $6('#menu-toggle').attr('aria-label'));
console.log('Button aria-expanded:', $6('#menu-toggle').attr('aria-expanded'));
console.log('Menu aria-hidden:', $6('#menu').attr('aria-hidden'));

// Example 7: Modifying links
console.log('\n\nExample 7: Modifying Links');
const html7 = `
    <div>
        <a href="/page1" class="internal-link">Page 1</a>
        <a href="/page2" class="internal-link">Page 2</a>
        <a href="https://external.com" class="external-link">External</a>
    </div>
`;
const $7 = jq(html7);

// Make external links open in new tab
$7('a.external-link')
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer');

// Add title to internal links
$7('a.internal-link').each(function () {
    const $link = jq(this);
    const href = $link.attr('href');
    $link.attr('title', `Navigate to ${href}`);
});

console.log('External link target:', $7('a.external-link').attr('target'));
console.log('External link rel:', $7('a.external-link').attr('rel'));

// Example 8: Form field attributes
console.log('\n\nExample 8: Form Field Attributes');
const html8 = `
    <form>
        <input type="text" name="username">
        <input type="password" name="password">
        <input type="email" name="email">
        <input type="tel" name="phone">
    </form>
`;
const $8 = jq(html8);

$8('input[name="username"]')
    .attr('placeholder', 'Enter your username')
    .attr('autocomplete', 'username')
    .attr('required', true)
    .attr('minlength', '3')
    .attr('maxlength', '20');

$8('input[name="password"]')
    .attr('placeholder', 'Enter your password')
    .attr('autocomplete', 'current-password')
    .attr('required', true)
    .attr('minlength', '8');

$8('input[name="email"]')
    .attr('placeholder', 'your.email@example.com')
    .attr('autocomplete', 'email')
    .attr('required', true);

$8('input[name="phone"]')
    .attr('placeholder', '+1 (555) 123-4567')
    .attr('pattern', '[+]?[0-9 ()-]+');

console.log('Username placeholder:', $8('input[name="username"]').attr('placeholder'));
console.log('Username minlength:', $8('input[name="username"]').attr('minlength'));
console.log('Password required:', $8('input[name="password"]').attr('required'));
console.log('Phone pattern:', $8('input[name="phone"]').attr('pattern'));

// Example 9: Image attributes
console.log('\n\nExample 9: Image Attributes');
const html9 = `
    <div class="gallery">
        <img src="thumb1.jpg" data-full="full1.jpg">
        <img src="thumb2.jpg" data-full="full2.jpg">
        <img src="thumb3.jpg" data-full="full3.jpg">
    </div>
`;
const $9 = jq(html9);

$9('img').each(function (index) {
    const $img = jq(this);
    $img.attr('alt', `Gallery image ${index + 1}`)
        .attr('loading', 'lazy')
        .attr('decoding', 'async')
        .attr('width', '300')
        .attr('height', '200');
});

console.log('First image attributes:');
const $firstImg = $9('img').eq(0);
console.log('  alt:', $firstImg.attr('alt'));
console.log('  loading:', $firstImg.attr('loading'));
console.log('  data-full:', $firstImg.attr('data-full'));
console.log('  width:', $firstImg.attr('width'));

// Example 10: Conditional attributes
console.log('\n\nExample 10: Conditional Attributes');
const html10 = `
    <div id="widget" data-status="processing">
        <span class="message">Processing...</span>
    </div>
`;
const $10 = jq(html10);

function updateWidgetStatus(status: string) {
    const $widget = $10('#widget');

    if (status === 'loading') {
        $widget.attr('data-status', 'loading')
            .attr('aria-busy', 'true');
    } else if (status === 'error') {
        $widget.attr('data-status', 'error')
            .attr('aria-invalid', 'true')
            .attr('data-error-message', 'Something went wrong');
    } else if (status === 'success') {
        $widget.attr('data-status', 'success')
            .attr('aria-busy', 'false')
            .attr('data-completed', 'true');
    }
}

// Simulate different states
updateWidgetStatus('loading');
console.log('Loading state - aria-busy:', $10('#widget').attr('aria-busy'));

updateWidgetStatus('error');
console.log('Error state - aria-invalid:', $10('#widget').attr('aria-invalid'));
console.log('Error state - message:', $10('#widget').attr('data-error-message'));

updateWidgetStatus('success');
console.log('Success state - completed:', $10('#widget').attr('data-completed'));

// Example 11: Getting non-existent attributes
console.log('\n\nExample 11: Non-Existent Attributes');
const html11 = `<div id="test">Content</div>`;
const $11 = jq(html11);

console.log('Missing class:', $11('#test').attr('class')); // undefined
console.log('Missing data-id:', $11('#test').attr('data-id')); // undefined
console.log('Missing href:', $11('#test').attr('href')); // undefined

// Checking before use
const className = $11('#test').attr('class');
if (className !== undefined) {
    console.log('Has class:', className);
} else {
    console.log('No class attribute');
}

console.log('\n=== End of Examples ===');
