import jq from '../../index';
import type { JqElement } from '../../types';

console.log('=== Filtering Methods Examples ===\n');

// filter() Examples
console.log('--- filter() ---\n');

console.log('Example 1: Filter by Class');
const html1 = `
    <ul>
        <li class="fruit">Apple</li>
        <li class="vegetable">Carrot</li>
        <li class="fruit">Banana</li>
        <li class="vegetable">Broccoli</li>
    </ul>
`;
const $1 = jq.load(html1);
const fruits = $1('li').filter('.fruit');
console.log('Fruits:', fruits.length);
fruits.each(function (this: JqElement) {
    console.log('  ', jq(this).text());
});

console.log('\nExample 2: Filter by Function');
const html2 = `
    <div>
        <span data-score="85">Alice</span>
        <span data-score="92">Bob</span>
        <span data-score="78">Charlie</span>
        <span data-score="95">Diana</span>
    </div>
`;
const $2 = jq.load(html2);
const highScores = $2('span').filter(function (this: JqElement): boolean {
    const score = jq(this).attr('data-score');
    return typeof score === 'string' ? parseInt(score) >= 90 : false;
});
console.log('High scorers:');
highScores.each(function (this: JqElement) {
    console.log('  ', jq(this).text(), '-', jq(this).attr('data-score'));
});

console.log('\n--- Combined Filtering ---\n');

console.log('Example 3: Complex Filtering Chain');
const html3 = `
    <div class="products">
        <div class="product" data-category="electronics" data-price="299">
            <span class="name">Laptop</span>
        </div>
        <div class="product" data-category="electronics" data-price="499">
            <span class="name">Phone</span>
        </div>
        <div class="product" data-category="electronics" data-price="99">
            <span class="name">Headphones</span>
        </div>
    </div>
`;
const $3 = jq.load(html3);

// Filter electronics under $200
const affordableElectronics = $3('.product')
    .filter('[data-category="electronics"]')
    .filter(function (this: JqElement): boolean {
        const price = jq(this).attr('data-price');
        return typeof price === 'string' ? parseInt(price) < 200 : false;
    });

console.log('Affordable electronics:');
affordableElectronics.each(function (this: JqElement) {
    const $product = jq(this);
    console.log('  ', $product.find('.name').text(), '-', '$' + $product.attr('data-price'));
});

console.log('\n=== End of Examples ===');
