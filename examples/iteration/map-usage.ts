import jq from '../../index';
import type { JqElement } from '../../types';

console.log('=== map() Method Examples ===\n');

console.log('Example 1: Map to Array of Texts');
const html1 = `
    <ul id="fruits">
        <li>Apple</li>
        <li>Banana</li>
        <li>Cherry</li>
        <li>Date</li>
    </ul>
`;
const $1 = jq.load(html1);
const fruits = $1('#fruits li')
    .map(function (this: JqElement): string {
        return jq(this).text();
    })
    .get();
console.log('Fruits array:', fruits);

console.log('\nExample 2: Map with Transformation');
const html2 = `
    <div>
        <span data-value="10">Ten</span>
        <span data-value="20">Twenty</span>
        <span data-value="30">Thirty</span>
    </div>
`;
const $2 = jq.load(html2);
const values = $2('span')
    .map(function (this: JqElement): number {
        return parseInt(jq(this).attr('data-value'));
    })
    .get();
console.log('Values:', values);
console.log(
    'Sum:',
    values.reduce((a, b) => a + b, 0),
);

console.log('\nExample 3: Map with Index');
const html3 = `
    <ul>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
    </ul>
`;
const $3 = jq.load(html3);
const indexed = $3('li')
    .map(function (this: JqElement, index: number): string {
        return `${index + 1}. ${jq(this).text()}`;
    })
    .get();
console.log('Indexed items:');
indexed.forEach((item) => console.log('  ', item));

console.log('\nExample 4: Extract Attributes');
const html4 = `
    <div>
        <a href="/page1">Link 1</a>
        <a href="/page2">Link 2</a>
        <a href="/page3">Link 3</a>
    </div>
`;
const $4 = jq.load(html4);
const urls = $4('a')
    .map(function (this: JqElement): string | undefined {
        return jq(this).attr('href');
    })
    .get();
console.log('URLs:', urls);

console.log('\nExample 5: Complex Data Extraction');
const html5 = `
    <table id="products">
        <tr>
            <td>Laptop</td>
            <td>$999</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Mouse</td>
            <td>$29</td>
            <td>15</td>
        </tr>
        <tr>
            <td>Keyboard</td>
            <td>$79</td>
            <td>8</td>
        </tr>
    </table>
`;
const $5 = jq.load(html5);
const products = $5('#products tr')
    .map(function (this: JqElement) {
        const $row = jq(this);
        const cells = $row.find('td');
        if (cells.length === 0) return null;

        return {
            name: cells.eq(0).text(),
            price: parseFloat(cells.eq(1).text().replace('$', '')),
            quantity: parseInt(cells.eq(2).text()),
        };
    })
    .get()
    .filter((item) => item !== null);

console.log('Products:');
products.forEach((p) => {
    console.log(`  ${p.name}: $${p.price} x ${p.quantity} = $${p.price * p.quantity}`);
});

console.log('\nExample 6: Form Data Collection');
const html6 = `
    <form>
        <input type="text" name="username" value="john_doe">
        <input type="email" name="email" value="john@example.com">
        <input type="number" name="age" value="30">
    </form>
`;
const $6 = jq.load(html6);
const formData = $6('input')
    .map(function (this: JqElement) {
        const $input = jq(this);
        return {
            name: $input.attr('name'),
            value: $input.attr('value'),
            type: $input.attr('type'),
        };
    })
    .get();

console.log('Form data:', JSON.stringify(formData, null, 2));

console.log('\n=== End of Examples ===');
