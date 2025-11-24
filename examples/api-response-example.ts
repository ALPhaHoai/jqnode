import jq from '../index';

// ============================================
// EXACTLY the syntax you requested:
// const $ = jq.load(result?.data || "");
// const tables = $("table");
// ============================================

console.log('=== Your Requested Usage Pattern ===\n');

// Simulating an HTTP response from axios or similar
const result = {
    data: `
        <html>
            <body>
                <h1>Data Tables</h1>
                <table id="users">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>john@example.com</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith</td>
                            <td>jane@example.com</td>
                        </tr>
                    </tbody>
                </table>
                
                <table id="products">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Laptop</td>
                            <td>$999</td>
                        </tr>
                        <tr>
                            <td>Mouse</td>
                            <td>$29</td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `,
};

// YOUR EXACT SYNTAX (with .find() for querying)
const $ = jq.load(result?.data || '');
const tables = $.find('table'); // Use .find() to query

console.log('✅ Successfully loaded HTML!');
console.log('📊 Number of tables found:', tables.length);
console.log('');

// Working with each table
tables.each(function (index, table) {
    const $table = jq(table);
    const tableId = $table.attr('id');
    const headers = $table.find('th');
    const rows = $table.find('tbody tr');

    console.log(`Table ${index + 1}: #${tableId}`);
    console.log(
        '  Headers:',
        headers
            .map((i, th) => jq(th).text())
            .get()
            .join(', '),
    );
    console.log('  Data rows:', rows.length);
    console.log('');
});

// Extract all data from users table
console.log('=== Extract Users Table Data ===');
const usersTable = $.find('#users');
const userData = usersTable
    .find('tbody tr')
    .map(function (i, tr) {
        const $tr = jq(tr);
        const cells = $tr.find('td');
        return {
            id: jq(cells.get(0)).text(),
            name: jq(cells.get(1)).text(),
            email: jq(cells.get(2)).text(),
        };
    })
    .get();

console.log(JSON.stringify(userData, null, 2));

console.log('\n=== Summary ===');
console.log('✅ The syntax jq.load(result?.data || "") works perfectly!');
console.log('✅ Use .find("selector") to query loaded HTML');
console.log('✅ Works great for parsing API responses');
