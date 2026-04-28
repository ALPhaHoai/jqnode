import jq from '../../index';
import type { JqElement } from '../../types';

console.log('=== addClass() Method Examples ===\n');

// Example 1: Basic single class
console.log('Example 1: Adding Single Class');
const html1 = `
    <div id="container">
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <p>Paragraph 3</p>
    </div>
`;
const $1 = jq.load(html1);

$1.find('p').addClass('paragraph');
console.log('All paragraphs have class:', $1.find('p').first().attr('class'));

// Example 2: Multiple classes at once
console.log('\n\nExample 2: Adding Multiple Classes');
const html2 = `<div id="box">Content</div>`;
const $2 = jq.load(html2);

$2.find('#box').addClass('highlighted bordered rounded shadow');
console.log('Box classes:', $2.find('#box').attr('class'));

// Example 3: Using function with index
console.log('\n\nExample 3: Using Function with Index');
const html3 = `
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li>Item 5</li>
    </ul>
`;
const $3 = jq.load(html3);

$3.find('li').addClass(function (this: JqElement, index: number): string {
    return index % 2 === 0 ? 'even' : 'odd';
});

console.log('List item classes:');
$3.find('li').each(function (this: JqElement, i: number) {
    console.log(`  Item ${i + 1}: ${jq(this).attr('class')}`);
});

// Example 4: Preserving existing classes
console.log('\n\nExample 4: Preserving Existing Classes');
const html4 = `<div class="existing-class">Content</div>`;
const $4 = jq.load(html4);

$4.find('div').addClass('new-class another-class');
console.log('Combined classes:', $4.find('div').attr('class'));

// Example 5: Method chaining
console.log('\n\nExample 5: Method Chaining');
const html5 = `<div id="element">Text</div>`;
const $5 = jq.load(html5);

$5.find('#element')
    .addClass('primary')
    .addClass('active')
    .addClass('highlighted')
    .attr('data-status', 'ready');

console.log('Chained classes:', $5.find('#element').attr('class'));

// Example 6: Conditional classes based on data
console.log('\n\nExample 6: Conditional Classes');
const html6 = `
    <div>
        <span data-priority="high">High Priority</span>
        <span data-priority="medium">Medium Priority</span>
        <span data-priority="low">Low Priority</span>
        <span data-priority="high">High Priority 2</span>
    </div>
`;
const $6 = jq.load(html6);

$6.find('span').addClass(function (this: JqElement): string {
    const priority = jq(this).attr('data-priority');
    const classMap: Record<string, string> = {
        high: 'text-danger font-bold',
        medium: 'text-warning',
        low: 'text-muted',
    };
    return classMap[priority] || '';
});

console.log('Priority-based classes:');
$6.find('span').each(function (this: JqElement) {
    const $span = jq(this);
    console.log(`  ${$span.attr('data-priority')}: ${$span.attr('class')}`);
});

// Example 7: Form field states
console.log('\n\nExample 7: Form Field States');
const html7 = `
    <form>
        <input type="text" id="username" value="john_doe">
        <input type="email" id="email" value="">
        <input type="password" id="password" value="secret123">
        <input type="tel" id="phone" value="">
    </form>
`;
const $7 = jq.load(html7);

$7.find('input')
    .addClass('form-control')
    .addClass(function (this: JqElement): string {
        const value = jq(this).attr('value');
        return value ? 'has-value' : 'is-empty';
    });

console.log('Form field classes:');
$7.find('input').each(function (this: JqElement) {
    const $input = jq(this);
    console.log(`  ${$input.attr('id')}: ${$input.attr('class')}`);
});

// Example 8: Table row striping
console.log('\n\nExample 8: Table Row Striping');
const html8 = `
    <table id="data-table">
        <tr><td>Alice</td><td>Developer</td></tr>
        <tr><td>Bob</td><td>Designer</td></tr>
        <tr><td>Charlie</td><td>Manager</td></tr>
        <tr><td>Diana</td><td>Analyst</td></tr>
    </table>
`;
const $8 = jq.load(html8);

$8.find('tr').addClass(function (this: JqElement, index: number): string {
    return `row row-${index % 2 === 0 ? 'even' : 'odd'}`;
});

$8.find('td').addClass('cell');

console.log('Table structure:');
$8.find('tr').each(function (this: JqElement, i: number) {
    const $row = jq(this);
    console.log(`  Row ${i + 1}: ${$row.attr('class')}`);
});

// Example 9: Navigation menu with active state
console.log('\n\nExample 9: Navigation Menu');
const html9 = `
    <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
`;
const $9 = jq.load(html9);
const currentPath = '/products';

$9.find('a')
    .addClass('nav-link')
    .addClass(function (this: JqElement): string {
        const href = jq(this).attr('href');
        return href === currentPath ? 'active' : '';
    });

console.log('Navigation links:');
$9.find('a').each(function (this: JqElement) {
    const $link = jq(this);
    console.log(`  ${$link.text()}: ${$link.attr('class')}`);
});

// Example 10: Button variants
console.log('\n\nExample 10: Button Variants');
const html10 = `
    <div class="button-group">
        <button data-variant="primary">Save</button>
        <button data-variant="secondary">Cancel</button>
        <button data-variant="danger">Delete</button>
        <button data-variant="success">Confirm</button>
    </div>
`;
const $10 = jq.load(html10);

$10.find('button')
    .addClass('btn')
    .addClass(function (this: JqElement): string {
        const variant = jq(this).attr('data-variant');
        return `btn-${variant}`;
    });

console.log('Button classes:');
$10.find('button').each(function (this: JqElement) {
    const $btn = jq(this);
    console.log(`  ${$btn.text()}: ${$btn.attr('class')}`);
});

// Example 11: Dynamic list item numbering
console.log('\n\nExample 11: Dynamic Numbering');
const html11 = `
    <ol class="tasks">
        <li>First task</li>
        <li>Second task</li>
        <li>Third task</li>
    </ol>
`;
const $11 = jq.load(html11);

$11.find('li').addClass(function (this: JqElement, index: number): string {
    return `task task-${index + 1}`;
});

console.log('Task classes:');
$11.find('li').each(function (this: JqElement) {
    console.log(`  ${jq(this).text()}: ${jq(this).attr('class')}`);
});

// Example 12: Status indicators
console.log('\n\nExample 12: Status Indicators');
const html12 = `
    <div class="dashboard">
        <div class="widget" data-status="online">Server A</div>
        <div class="widget" data-status="offline">Server B</div>
        <div class="widget" data-status="maintenance">Server C</div>
        <div class="widget" data-status="online">Server D</div>
    </div>
`;
const $12 = jq.load(html12);

$12.find('.widget').addClass(function (this: JqElement, index: number, currentClass: string): string {
    const status = jq(this).attr('data-status');
    const statusClasses: Record<string, string> = {
        online: 'status-success',
        offline: 'status-error',
        maintenance: 'status-warning',
    };
    return statusClasses[status] || 'status-unknown';
});

console.log('Widget statuses:');
$12.find('.widget').each(function (this: JqElement) {
    const $widget = jq(this);
    console.log(`  ${$widget.text()}: ${$widget.attr('class')}`);
});

console.log('\n=== End of Examples ===');
