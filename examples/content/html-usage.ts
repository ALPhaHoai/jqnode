import jq from '../../index';
import type { JqElement } from '../../types';

console.log('=== html() Method Examples ===\n');

// Example 1: Get HTML content
console.log('Example 1: Get HTML Content');
const html1 = `<div id="container"><p>Hello <strong>World</strong></p></div>`;
const $1 = jq.load(html1);
console.log('HTML content:', $1('#container').html());

// Example 2: Set HTML content
console.log('\n\nExample 2: Set HTML Content');
const html2 = `<div id="box">Old content</div>`;
const $2 = jq.load(html2);
$2('#box').html('<p>New <em>HTML</em> content</p>');
console.log('After setting:', $2('#box').html());

// Example 3: Replace entire content
console.log('\n\nExample 3: Replace Content');
const html3 = `
    <ul id="list">
        <li>Old item 1</li>
        <li>Old item 2</li>
    </ul>
`;
const $3 = jq.load(html3);
$3('#list').html('<li>New item 1</li><li>New item 2</li><li>New item 3</li>');
console.log('Items after replacement:', $3('#list').children().length);

// Example 4: Build dynamic content
console.log('\n\nExample 4: Dynamic Content Building');
const html4 = `<div id="app"></div>`;
const $4 = jq.load(html4);
const dynamicContent = `
    <header>
        <h1>My Application</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>
    </header>
    <main>
        <section class="content">
            <p>Welcome to the application!</p>
        </section>
    </main>
`;
$4('#app').html(dynamicContent);
console.log('App has header:', $4('header').length > 0);
console.log('App has main:', $4('main').length > 0);

// Example 5: Get from multiple elements (gets first)
console.log('\n\nExample 5: Multiple Elements');
const html5 = `
    <div>
        <div class="box"><span>First box</span></div>
        <div class="box"><span>Second box</span></div>
    </div>
`;
const $5 = jq.load(html5);
console.log('HTML from first .box:', $5('.box').html());

// Example 6: Set on multiple elements
console.log('\n\nExample 6: Set on Multiple Elements');
const html6 = `
    <div>
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
    </div>
`;
const $6 = jq.load(html6);
$6('.card').html('<h3>New Card Title</h3><p>Card content</p>');
console.log('Each card now contains:');
$6('.card').each(function (this: JqElement, i: number) {
    console.log(`  Card ${i + 1}:`, jq(this).html());
});

// Example 7: Template rendering
console.log('\n\nExample 7: Template Rendering');
const html7 = `<div id="user-profile"></div>`;
const $7 = jq.load(html7);
const userData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Administrator',
};
const template = `
    <div class="profile">
        <h2>${userData.name}</h2>
        <p>Email: ${userData.email}</p>
        <p>Role: ${userData.role}</p>
    </div>
`;
$7('#user-profile').html(template);
console.log('Profile rendered:', $7('.profile').length > 0);

console.log('\n=== End of Examples ===');
