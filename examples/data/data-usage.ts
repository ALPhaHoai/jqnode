import jq from '../index';

console.log('=== data() Method Examples ===\n');

// Example 1: Setting and getting single values
console.log('Example 1: Setting and Getting Data');
const html1 = `<div id="user">John Doe</div>`;
const $1 = jq(html1);

$1('#user').data('userId', 12345);
$1('#user').data('role', 'admin');
$1('#user').data('active', true);
$1('#user').data('loginCount', 42);

console.log('User ID:', $1('#user').data('userId'));
console.log('Role:', $1('#user').data('role'));
console.log('Active:', $1('#user').data('active'));
console.log('Login Count:', $1('#user').data('loginCount'));

// Example 2: Setting multiple values at once
console.log('\n\nExample 2: Setting Multiple Values');
const html2 = `<div id="product"></div>`;
const $2 = jq(html2);

$2('#product').data({
    sku: 'PROD-12345',
    name: 'Wireless Mouse',
    price: 29.99,
    inStock: true,
    quantity: 150,
    category: 'Electronics',
});

console.log('Product SKU:', $2('#product').data('sku'));
console.log('Product Name:', $2('#product').data('name'));
console.log('Price: $' + $2('#product').data('price'));
console.log('In Stock:', $2('#product').data('inStock'));

// Example 3: Getting all data
console.log('\n\nExample 3: Getting All Data');
const html3 = `<div id="widget" data-widget-type="calendar" data-theme="dark"></div>`;
const $3 = jq(html3);

$3('#widget').data('initialized', true);
$3('#widget').data('version', '2.0.1');

const allData = $3('#widget').data();
console.log('All data:', JSON.stringify(allData, null, 2));

// Example 4: Data attribute integration and type conversion
console.log('\n\nExample 4: Data Attributes with Type Conversion');
const html4 = `
    <div id="config"
         data-enabled="true"
         data-max-items="100"
         data-timeout="5000"
         data-mode="production"
         data-options='{"debug":false,"verbose":true}'>
    </div>
`;
const $4 = jq(html4);

console.log(
    'Enabled (boolean):',
    $4('#config').data('enabled'),
    typeof $4('#config').data('enabled'),
);
console.log(
    'Max Items (number):',
    $4('#config').data('maxItems'),
    typeof $4('#config').data('maxItems'),
);
console.log(
    'Timeout (number):',
    $4('#config').data('timeout'),
    typeof $4('#config').data('timeout'),
);
console.log('Mode (string):', $4('#config').data('mode'), typeof $4('#config').data('mode'));
console.log('Options (object):', $4('#config').data('options'));

// Example 5: Storing complex objects
console.log('\n\nExample 5: Storing Complex Objects and Arrays');
const html5 = `<div id="app"></div>`;
const $5 = jq(html5);

$5('#app').data('user', {
    id: 1001,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    roles: ['admin', 'editor'],
    preferences: {
        theme: 'dark',
        language: 'en',
        notifications: {
            email: true,
            push: false,
        },
    },
});

$5('#app').data('permissions', ['create', 'read', 'update', 'delete']);

const user = $5('#app').data('user');
console.log('User Name:', user.name);
console.log('User Email:', user.email);
console.log('User Roles:', user.roles.join(', '));
console.log('Theme:', user.preferences.theme);

const permissions = $5('#app').data('permissions');
console.log('Has delete permission:', permissions.includes('delete'));

// Example 6: Setting data on multiple elements
console.log('\n\nExample 6: Setting Data on Multiple Elements');
const html6 = `
    <div class="cards">
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
    </div>
`;
const $6 = jq(html6);

// Set same data on all cards
$6('.card').data('type', 'info-card');
$6('.card').data('clickable', true);

// Set unique data per card
$6('.card').each(function (index) {
    jq(this).data('cardId', `CARD-${index + 1}`);
    jq(this).data('position', index);
});

console.log('Card data:');
$6('.card').each(function (index) {
    const $card = jq(this);
    console.log(`  Card ${index + 1}:`, {
        id: $card.data('cardId'),
        type: $card.data('type'),
        position: $card.data('position'),
        clickable: $card.data('clickable'),
    });
});

// Example 7: Method chaining
console.log('\n\nExample 7: Method Chaining');
const html7 = `<div id="panel"></div>`;
const $7 = jq(html7);

$7('#panel')
    .data('status', 'active')
    .data('priority', 'high')
    .data('count', 0)
    .attr('class', 'panel')
    .attr('id', 'main-panel');

console.log('Panel status:', $7('#panel').data('status'));
console.log('Panel priority:', $7('#panel').data('priority'));
console.log('Panel count:', $7('#panel').data('count'));

// Example 8: Caching computed results
console.log('\n\nExample 8: Caching Expensive Computations');
const html8 = `<div id="stats"></div>`;
const $8 = jq(html8);

function expensiveCalculation() {
    // Simulate expensive operation
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    }
    return { total: sum, calculated: new Date() };
}

// Calculate and cache
const result = expensiveCalculation();
$8('#stats').data('computedResult', result);

// Retrieve from cache (no recalculation)
const cached = $8('#stats').data('computedResult');
console.log('Cached result total:', cached.total);
console.log('Calculated at:', cached.calculated.toISOString());

// Example 9: Event tracking
console.log('\n\nExample 9: Event Tracking');
const html9 = `<button id="action-btn">Click Me</button>`;
const $9 = jq(html9);

// Initialize counters
$9('#action-btn').data('clicks', 0);
$9('#action-btn').data('lastClicked', null);
$9('#action-btn').data('clickHistory', []);

function simulateClick() {
    const $btn = $9('#action-btn');
    const clicks = $btn.data('clicks') + 1;
    const now = new Date();
    const history = $btn.data('clickHistory');

    $btn.data('clicks', clicks);
    $btn.data('lastClicked', now);
    history.push(now);

    console.log(`Button clicked ${clicks} time(s)`);
}

// Simulate some clicks
simulateClick();
simulateClick();
simulateClick();

console.log('Total clicks:', $9('#action-btn').data('clicks'));
console.log('Last clicked:', $9('#action-btn').data('lastClicked'));
console.log('Click history length:', $9('#action-btn').data('clickHistory').length);

// Example 10: State management
console.log('\n\nExample 10: Component State Management');
const html10 = `<div id="dropdown"></div>`;
const $10 = jq(html10);

// Initialize state
$10('#dropdown').data('state', {
    isOpen: false,
    selectedIndex: -1,
    items: ['Option 1', 'Option 2', 'Option 3'],
    lastAction: null,
});

function toggleDropdown() {
    const state = $10('#dropdown').data('state');
    state.isOpen = !state.isOpen;
    state.lastAction = { type: 'toggle', timestamp: Date.now() };
    console.log('Dropdown', state.isOpen ? 'opened' : 'closed');
}

function selectItem(index) {
    const state = $10('#dropdown').data('state');
    state.selectedIndex = index;
    state.lastAction = { type: 'select', index, timestamp: Date.now() };
    console.log('Selected:', state.items[index]);
}

toggleDropdown();
selectItem(1);
toggleDropdown();

const finalState = $10('#dropdown').data('state');
console.log('Final state:', JSON.stringify(finalState, null, 2));

// Example 11: Form validation state
console.log('\n\nExample 11: Form Validation State');
const html11 = `
    <form>
        <input type="email" id="email" name="email" value="user@example.com">
        <input type="password" id="password" name="password" value="short">
        <input type="text" id="username" name="username" value="validuser123">
    </form>
`;
const $11 = jq(html11);

function validateEmail($field) {
    const value = $field.attr('value');
    const isValid = value.includes('@') && value.includes('.');

    $field.data({
        isValid: isValid,
        validationMessage: isValid ? 'Valid email' : 'Invalid email format',
        lastValidated: new Date(),
    });
}

function validatePassword($field) {
    const value = $field.attr('value');
    const isValid = value.length >= 8;

    $field.data({
        isValid: isValid,
        validationMessage: isValid ? 'Strong password' : 'Password must be at least 8 characters',
        lastValidated: new Date(),
    });
}

function validateUsername($field) {
    const value = $field.attr('value');
    const isValid = /^[a-z0-9]+$/i.test(value) && value.length >= 3;

    $field.data({
        isValid: isValid,
        validationMessage: isValid ? 'Valid username' : 'Invalid username',
        lastValidated: new Date(),
    });
}

// Validate fields
validateEmail($11('#email'));
validatePassword($11('#password'));
validateUsername($11('#username'));

// Display validation results
console.log('Validation Results:');
$11('input').each(function () {
    const $input = jq(this);
    const name = $input.attr('name');
    const isValid = $input.data('isValid');
    const message = $input.data('validationMessage');

    console.log(`  ${name}: ${isValid ? '✓' : '✗'} - ${message}`);
});

// Example 12: API response caching
console.log('\n\nExample 12: API Response Caching');
const html12 = `<div id="user-profile" data-user-id="12345"></div>`;
const $12 = jq(html12);

function fetchUserData(useCache = true) {
    const $profile = $12('#user-profile');

    // Check cache first
    if (useCache && $profile.data('userData')) {
        console.log('📦 Retrieved from cache');
        return $profile.data('userData');
    }

    // Simulate API call
    console.log('🌐 Fetching from API...');
    const userData = {
        id: $profile.attr('data-user-id'),
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'avatar.jpg',
        fetchedAt: new Date(),
        roles: ['user', 'premium'],
    };

    // Cache the result
    $profile.data('userData', userData);
    $profile.data('cacheExpiry', Date.now() + 60000); // 1 minute

    return userData;
}

// First call - fetches from "API"
const user1 = fetchUserData();
console.log('User:', user1.name);

// Second call - uses cache
const user2 = fetchUserData();
console.log('User:', user2.name);

// Force refresh
const user3 = fetchUserData(false);
console.log('User (refreshed):', user3.name);

console.log('\n=== End of Examples ===');
