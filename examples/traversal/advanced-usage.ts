import jq from '../index';

console.log('=== map(), closest(), Comprehensive Methods Examples ===\n');

// map() Examples
console.log('--- map() ---\n');

console.log('Example 1: Map to Array of Text');
const html1 = `
    <ul>
        <li>Apple</li>
        <li>Banana</li>
        <li>Cherry</li>
    </ul>
`;
const $1 = jq(html1);
const fruits = $1('li')
    .map(function () {
        return jq(this).text();
    })
    .get();
console.log('Fruits:', fruits);

console.log('\nExample 2: Map with Transformation');
const html2 = `
    <div>
        <span data-price="10">Item 1</span>
        <span data-price="25">Item 2</span>
        <span data-price="15">Item 3</span>
    </div>
`;
const $2 = jq(html2);
const prices = $2('span')
    .map(function () {
        return parseFloat(jq(this).attr('data-price'));
    })
    .get();
console.log('Prices:', prices);
console.log(
    'Total:',
    prices.reduce((a, b) => a + b, 0),
);

console.log('\nExample 3: Map with Index');
const html3 = `
    <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
    </ul>
`;
const $3 = jq(html3);
const indexed = $3('li')
    .map(function (index) {
        return `${index + 1}. ${jq(this).text()}`;
    })
    .get();
console.log('Indexed items:');
indexed.forEach((item) => console.log('  ', item));

// closest() Examples
console.log('\n--- closest() ---\n');

console.log('Example 4: Find Closest Ancestor');
const html4 = `
    <div class="container">
        <div class="section">
            <div class="content">
                <p>
                    <span id="deep">Deep element</span>
                </p>
            </div>
        </div>
    </div>
`;
const $4 = jq(html4);
console.log('Closest .content:', $4('#deep').closest('.content').attr('class'));
console.log('Closest .section:', $4('#deep').closest('.section').attr('class'));
console.log('Closest .container:', $4('#deep').closest('.container').attr('class'));

console.log('\nExample 5: Event Delegation Pattern');
const html5 = `
    <ul class="menu">
        <li>
            <a href="/page1">
                <span class="icon">🏠</span>
                <span class="label" id="clicked">Home</span>
            </a>
        </li>
    </ul>
`;
const $5 = jq(html5);
const clickedSpan = $5('#clicked');
const menuItem = clickedSpan.closest('li');
const link = clickedSpan.closest('a');
console.log('Clicked element:', clickedSpan.text());
console.log('Closest link href:', link.attr('href'));
console.log('Closest li found:', menuItem.length > 0);

console.log('\nExample 6: Form Field Validation');
const html6 = `
    <form id="user-form">
        <div class="field-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email">
            <span class="error-message" style="display:none">Invalid email</span>
        </div>
    </form>
`;
const $6 = jq(html6);
const emailInput = $6('#email');
const fieldGroup = emailInput.closest('.field-group');
const form = emailInput.closest('form');
console.log('Input is in field-group:', fieldGroup.length > 0);
console.log('Input is in form:', form.attr('id'));

// Practical Combinations
console.log('\n--- Practical Combinations ---\n');

console.log('Example 7: Extract and Transform Data');
const html7 = `
    <table id="products">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Widget</td>
                <td>$19.99</td>
                <td>5</td>
            </tr>
            <tr>
                <td>Gadget</td>
                <td>$29.99</td>
                <td>3</td>
            </tr>
        </tbody>
    </table>
`;
const $7 = jq(html7);
const products = $7('#products tbody tr')
    .map(function () {
        const $row = jq(this);
        const cells = $row.find('td');
        return {
            name: cells.eq(0).text(),
            price: parseFloat(cells.eq(1).text().replace('$', '')),
            qty: parseInt(cells.eq(2).text()),
        };
    })
    .get();
console.log('Products:', JSON.stringify(products, null, 2));

console.log('\nExample 8: Menu Navigation with closest()');
const html8 = `
    <nav class="main-nav">
        <ul>
            <li class="menu-item">
                <a href="/home">Home</a>
            </li>
            <li class="menu-item has-dropdown">
                <a href="/products">Products</a>
                <ul class="dropdown">
                    <li><a href="/products/electronics" id="current-link">Electronics</a></li>
                    <li><a href="/products/books">Books</a></li>
                </ul>
            </li>
        </ul>
    </nav>
`;
const $8 = jq(html8);
const currentLink = $8('#current-link');
const parentMenuItem = currentLink.closest('.menu-item');
const mainNav = currentLink.closest('.main-nav');
console.log('Current link:', currentLink.text());
console.log('Parent menu item has dropdown:', parentMenuItem.hasClass('has-dropdown'));
console.log('Inside main nav:', mainNav.attr('class'));

console.log('\nExample 9: Collect Form Data');
const html9 = `
    <form id="registration">
        <input type="text" name="username" value="john_doe">
        <input type="email" name="email" value="john@example.com">
        <input type="number" name="age" value="30">
        <select name="country">
            <option value="us" selected>USA</option>
            <option value="uk">UK</option>
        </select>
    </form>
`;
const $9 = jq(html9);
const formData = $9('#registration')
    .find('input, select')
    .map(function () {
        const $field = jq(this);
        return {
            name: $field.attr('name'),
            value: $field.val(),
        };
    })
    .get();
console.log('Form data:', formData);

console.log('\nExample 10: Build Options List');
const html10 = `
    <div id="data-source">
        <div class="option" data-value="1">Option One</div>
        <div class="option" data-value="2">Option Two</div>
        <div class="option" data-value="3">Option Three</div>
    </div>
    <select id="target-select"></select>
`;
const $10 = jq(html10);
const options = $10('.option')
    .map(function () {
        const $opt = jq(this);
        return `<option value="${$opt.attr('data-value')}">${$opt.text()}</option>`;
    })
    .get()
    .join('');
$10('#target-select').html(options);
console.log('Select now has options:', $10('#target-select option').length);

console.log('\n=== End of Examples ===');
