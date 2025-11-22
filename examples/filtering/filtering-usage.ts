import jq from '../../index';

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
const $1 = jq(html1);
const fruits = $1('li').filter('.fruit');
console.log('Fruits:', fruits.length);
fruits.each(function () {
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
const $2 = jq(html2);
const highScores = $2('span').filter(function () {
    return parseInt(jq(this).attr('data-score')) >= 90;
});
console.log('High scorers:');
highScores.each(function () {
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
const $3 = jq(html3);

// Filter electronics under $200
const affordableElectronics = $3('.product')
    .filter('[data-category="electronics"]')
    .filter(function () {
        return parseInt(jq(this).attr('data-price')) < 200;
    });

console.log('Affordable electronics:');
affordableElectronics.each(function () {
    const $product = jq(this);
    console.log('  ', $product.find('.name').text(), '-', '$' + $product.attr('data-price'));
});

console.log('\n=== End of Examples ===');
