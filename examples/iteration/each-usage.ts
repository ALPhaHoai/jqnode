import jq from '../index';

console.log('=== each() Method Examples ===\n');

// Example 1: Basic iteration
console.log('Example 1: Basic Iteration');
const html1 = `
    <ul id="fruits">
        <li>Apple</li>
        <li>Banana</li>
        <li>Cherry</li>
        <li>Date</li>
    </ul>
`;
const $1 = jq(html1);

console.log('Iterating over list items:');
$1('li').each(function (index, element) {
    console.log(`  ${index}: ${jq(element).text()}`);
});

// Example 2: Using 'this' context
console.log('\n\nExample 2: Using "this" Context');
const html2 = `
    <div>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
    </div>
`;
const $2 = jq(html2);

$2('p').each(function (index) {
    const $this = jq(this);
    const text = $this.text();
    console.log(`${index + 1}. ${text}`);
});

// Example 3: Modifying elements
console.log('\n\nExample 3: Modifying Elements During Iteration');
const html3 = `
    <div class="container">
        <div class="box">Box 1</div>
        <div class="box">Box 2</div>
        <div class="box">Box 3</div>
        <div class="box">Box 4</div>
    </div>
`;
const $3 = jq(html3);

$3('.box').each(function (index) {
    jq(this)
        .attr('data-index', index)
        .attr('id', `box-${index}`)
        .addClass(index % 2 === 0 ? 'even' : 'odd');
});

console.log('Modified elements:');
$3('.box').each(function () {
    const $box = jq(this);
    console.log(
        'ID:', $box.attr('id'),
        '| Class:', $box.attr('class'),
        '| Data-index:', $box.attr('data-index')
    );
});

// Example 4: Breaking early with false
console.log('\n\nExample 4: Breaking Loop Early');
const html4 = `
    <ul>
        <li>Process me</li>
        <li>Process me too</li>
        <li class="stop">Stop here!</li>
        <li>Don't process me</li>
        <li>Don't process me either</li>
    </ul>
`;
const $4 = jq(html4);

console.log('Processing until we hit .stop:');
let count = 0;
$4('li').each(function (index) {
    const $li = jq(this);
    count++;
    console.log(`  Processing item ${index}: ${$li.text()}`);

    if ($li.hasClass('stop')) {
        console.log('  → Breaking loop!');
        return false;
    }
});
console.log(`Total items processed: ${count} out of ${$4('li').length}`);

// Example 5: Collecting data
console.log('\n\nExample 5: Collecting Data from Elements');
const html5 = `
    <table id="employees">
        <thead>
            <tr><th>Name</th><th>Age</th><th>Department</th></tr>
        </thead>
        <tbody>
            <tr><td>Alice</td><td>28</td><td>Engineering</td></tr>
            <tr><td>Bob</td><td>35</td><td>Marketing</td></tr>
            <tr><td>Charlie</td><td>42</td><td>Sales</td></tr>
        </tbody>
    </table>
`;
const $5 = jq(html5);

const employees = [];
$5('tbody tr').each(function () {
    const $row = jq(this);
    const cells = $row.find('td');

    employees.push({
        name: cells.eq(0).text(),
        age: parseInt(cells.eq(1).text()),
        department: cells.eq(2).text()
    });
});

console.log('Collected employee data:');
console.log(JSON.stringify(employees, null, 2));

// Example 6: Method chaining
console.log('\n\nExample 6: Method Chaining');
const html6 = `<div><span>A</span><span>B</span><span>C</span></div>`;
const $6 = jq(html6);

$6('span')
    .each(function (i) {
        jq(this).attr('data-letter', jq(this).text().toLowerCase());
    })
    .addClass('letter')
    .attr('data-type', 'character');

console.log('After chaining:');
$6('span').each(function () {
    const $span = jq(this);
    console.log(
        'Text:', $span.text(),
        '| data-letter:', $span.attr('data-letter'),
        '| class:', $span.attr('class')
    );
});

// Example 7: Conditional processing
console.log('\n\nExample 7: Conditional Processing');
const html7 = `
    <ul class="tasks">
        <li class="completed">Buy groceries</li>
        <li>Call dentist</li>
        <li class="completed">Pay bills</li>
        <li>Clean house</li>
        <li class="completed">Send email</li>
    </ul>
`;
const $7 = jq(html7);

let completedCount = 0;
let pendingCount = 0;

$7('.tasks li').each(function (index) {
    const $task = jq(this);

    if ($task.hasClass('completed')) {
        $task.attr('data-status', 'done');
        completedCount++;
        console.log(`✓ ${$task.text()} (completed)`);
    } else {
        $task.attr('data-status', 'pending');
        pendingCount++;
        console.log(`○ ${$task.text()} (pending)`);
    }
});

console.log(`\nSummary: ${completedCount} completed, ${pendingCount} pending`);

// Example 8: Processing form fields
console.log('\n\nExample 8: Processing Form Fields');
const html8 = `
    <form id="userForm">
        <input type="text" name="firstName" value="John">
        <input type="text" name="lastName" value="Doe">
        <input type="email" name="email" value="john.doe@example.com">
        <input type="tel" name="phone" value="555-1234">
    </form>
`;
const $8 = jq(html8);

const formData = {};
$8('#userForm input').each(function () {
    const $input = jq(this);
    const name = $input.attr('name');
    const value = $input.attr('value');
    formData[name] = value;
});

console.log('Form data collected:');
console.log(JSON.stringify(formData, null, 2));

// Example 9: Adding sequential numbers
console.log('\n\nExample 9: Adding Sequential IDs');
const html9 = `
    <div class="items">
        <article>Article about JavaScript</article>
        <article>Article about CSS</article>
        <article>Article about HTML</article>
    </div>
`;
const $9 = jq(html9);

$9('article').each(function (index) {
    const $article = jq(this);
    const articleId = `ART-${String(index + 1).padStart(4, '0')}`;
    $article.attr('id', articleId);
    $article.attr('data-article-number', index + 1);
});

console.log('Articles with IDs:');
$9('article').each(function () {
    const $article = jq(this);
    console.log(`${$article.attr('id')}: ${$article.text()}`);
});

// Example 10: Nested iteration
console.log('\n\nExample 10: Nested Iteration');
const html10 = `
    <div class="catalog">
        <section class="category">
            <h3>Electronics</h3>
            <div class="product">Laptop</div>
            <div class="product">Phone</div>
        </section>
        <section class="category">
            <h3>Books</h3>
            <div class="product">Fiction Novel</div>
            <div class="product">Programming Guide</div>
            <div class="product">History Book</div>
        </section>
    </div>
`;
const $10 = jq(html10);

$10('.category').each(function (catIndex) {
    const $category = jq(this);
    const categoryName = $category.find('h3').text();

    console.log(`\nCategory ${catIndex + 1}: ${categoryName}`);

    $category.find('.product').each(function (prodIndex) {
        const $product = jq(this);
        const productName = $product.text();
        console.log(`  ${prodIndex + 1}. ${productName}`);
    });
});

// Example 11: Finding specific element
console.log('\n\nExample 11: Finding Specific Element and Stopping');
const html11 = `
    <ul class="users">
        <li data-user-id="101">Alice</li>
        <li data-user-id="102">Bob</li>
        <li data-user-id="103">Charlie</li>
        <li data-user-id="104">Diana</li>
        <li data-user-id="105">Eve</li>
    </ul>
`;
const $11 = jq(html11);

const targetUserId = '103';
let foundUser = null;

console.log(`Searching for user ID: ${targetUserId}`);
$11('.users li').each(function () {
    const $user = jq(this);
    const userId = $user.attr('data-user-id');

    console.log(`  Checking user ${userId}...`);

    if (userId === targetUserId) {
        foundUser = {
            id: userId,
            name: $user.text()
        };
        console.log(`  ✓ Found!`);
        return false; // Stop searching
    }
});

if (foundUser) {
    console.log(`\nResult: User ${foundUser.id} is ${foundUser.name}`);
}

// Example 12: Statistics calculation
console.log('\n\nExample 12: Calculating Statistics');
const html12 = `
    <div class="scores">
        <div class="score" data-points="85">Test 1</div>
        <div class="score" data-points="92">Test 2</div>
        <div class="score" data-points="78">Test 3</div>
        <div class="score" data-points="88">Test 4</div>
        <div class="score" data-points="95">Test 5</div>
    </div>
`;
const $12 = jq(html12);

let total = 0;
let count = 0;
let highest = -Infinity;
let lowest = Infinity;

$12('.score').each(function () {
    const $score = jq(this);
    const points = parseInt($score.attr('data-points'));

    total += points;
    count++;
    highest = Math.max(highest, points);
    lowest = Math.min(lowest, points);

    console.log(`${$score.text()}: ${points} points`);
});

const average = total / count;
console.log(`\nStatistics:`);
console.log(`  Average: ${average.toFixed(1)}`);
console.log(`  Highest: ${highest}`);
console.log(`  Lowest: ${lowest}`);
console.log(`  Total: ${total}`);

console.log('\n=== End of Examples ===');
