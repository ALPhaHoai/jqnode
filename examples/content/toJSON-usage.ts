import jq from '../index';

console.log('=== toJSON() Method Examples ===\n');

// Example 1: Basic table with thead
console.log('Example 1: Basic Table');
const basicTable = `
    <table id="users">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>30</td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>25</td>
            </tr>
            <tr>
                <td>Bob Johnson</td>
                <td>bob@example.com</td>
                <td>35</td>
            </tr>
        </tbody>
    </table>
`;
const basicData = jq(basicTable).find('table').toJSON();
console.log('Basic table data:');
console.log(JSON.stringify(basicData, null, 2));

// Example 2: Table without thead
console.log('\n\nExample 2: Table Without <thead>');
const noTheadTable = `
    <table>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
        <tr>
            <td>Widget A</td>
            <td>$19.99</td>
            <td>50</td>
        </tr>
        <tr>
            <td>Widget B</td>
            <td>$29.99</td>
            <td>30</td>
        </tr>
        <tr>
            <td>Widget C</td>
            <td>$39.99</td>
            <td>15</td>
        </tr>
    </table>
`;
const noTheadData = jq(noTheadTable).find('table').toJSON();
console.log('Table without thead:');
console.log(JSON.stringify(noTheadData, null, 2));

// Example 3: Ignoring columns
console.log('\n\nExample 3: Ignoring Columns');
const employeeTable = `
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>001</td>
                <td>Alice Brown</td>
                <td>Engineering</td>
                <td>$95,000</td>
            </tr>
            <tr>
                <td>002</td>
                <td>Charlie Davis</td>
                <td>Marketing</td>
                <td>$75,000</td>
            </tr>
        </tbody>
    </table>
`;
// Ignore ID (index 0) and Salary (index 3) columns
const filteredData = jq(employeeTable)
    .find('table')
    .toJSON({
        ignoreColumns: [0, 3],
    });
console.log('Data without ID and Salary columns:');
console.log(JSON.stringify(filteredData, null, 2));

// Example 4: Including only specific columns
console.log('\n\nExample 4: Including Only Specific Columns');
const onlyNameEmail = jq(employeeTable)
    .find('table')
    .toJSON({
        onlyColumns: [1, 2], // Only Name and Department
    });
console.log('Only Name and Department:');
console.log(JSON.stringify(onlyNameEmail, null, 2));

// Example 5: Multiple tables
console.log('\n\nExample 5: Multiple Tables');
const multipleTables = `
    <div>
        <h2>Sales Team</h2>
        <table class="sales">
            <thead>
                <tr><th>Name</th><th>Region</th><th>Sales</th></tr>
            </thead>
            <tbody>
                <tr><td>Tom</td><td>North</td><td>$50K</td></tr>
                <tr><td>Sara</td><td>South</td><td>$65K</td></tr>
            </tbody>
        </table>
        
        <h2>Support Team</h2>
        <table class="support">
            <thead>
                <tr><th>Name</th><th>Tickets</th><th>Rating</th></tr>
            </thead>
            <tbody>
                <tr><td>Mike</td><td>150</td><td>4.8</td></tr>
                <tr><td>Lisa</td><td>200</td><td>4.9</td></tr>
            </tbody>
        </table>
    </div>
`;
const allTablesData = jq(multipleTables).find('table').toJSON();
console.log('All tables combined:');
console.log(JSON.stringify(allTablesData, null, 2));

// Example 6: Chaining with findTableWithHeader
console.log('\n\nExample 6: Chaining with findTableWithHeader()');
const specificTable = jq(multipleTables).findTableWithHeader('Region').toJSON();
console.log('Only tables with "Region" header:');
console.log(JSON.stringify(specificTable, null, 2));

// Example 7: Financial report table
console.log('\n\nExample 7: Financial Report');
const financialTable = `
    <table>
        <thead>
            <tr>
                <th>Quarter</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Margin %</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Q1 2024</td>
                <td>$250,000</td>
                <td>$150,000</td>
                <td>$100,000</td>
                <td>40%</td>
            </tr>
            <tr>
                <td>Q2 2024</td>
                <td>$300,000</td>
                <td>$170,000</td>
                <td>$130,000</td>
                <td>43%</td>
            </tr>
            <tr>
                <td>Q3 2024</td>
                <td>$280,000</td>
                <td>$165,000</td>
                <td>$115,000</td>
                <td>41%</td>
            </tr>
        </tbody>
    </table>
`;
const financialData = jq(financialTable).find('table').toJSON();
console.log('Financial data:');
console.log(JSON.stringify(financialData, null, 2));

// Example 8: Table with missing headers
console.log('\n\nExample 8: Missing Headers (Auto-generated Names)');
const missingHeadersTable = `
    <table>
        <tr>
            <th></th>
            <th>Name</th>
            <th></th>
            <th>Value</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Item A</td>
            <td>Active</td>
            <td>$100</td>
        </tr>
        <tr>
            <td>2</td>
            <td>Item B</td>
            <td>Inactive</td>
            <td>$200</td>
        </tr>
    </table>
`;
const missingHeaderData = jq(missingHeadersTable).find('table').toJSON();
console.log('Table with auto-generated column names:');
console.log(JSON.stringify(missingHeaderData, null, 2));

// Example 9: Practical use case - Data extraction
console.log('\n\nExample 9: Practical Use Case - Extract Active Products');
const inventoryTable = `
    <table id="inventory">
        <thead>
            <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>WGT-001</td>
                <td>Super Widget</td>
                <td>Widgets</td>
                <td>$49.99</td>
                <td>100</td>
                <td>Active</td>
            </tr>
            <tr>
                <td>GAD-002</td>
                <td>Mega Gadget</td>
                <td>Gadgets</td>
                <td>$79.99</td>
                <td>0</td>
                <td>Out of Stock</td>
            </tr>
            <tr>
                <td>WGT-003</td>
                <td>Mini Widget</td>
                <td>Widgets</td>
                <td>$29.99</td>
                <td>250</td>
                <td>Active</td>
            </tr>
        </tbody>
    </table>
`;

const inventory = jq(inventoryTable).find('table').toJSON();
// Filter active products with stock
const activeProducts = inventory.filter(
    (item) => item.Status === 'Active' && parseInt(item.Stock) > 0,
);
console.log('Active products in stock:');
console.log(JSON.stringify(activeProducts, null, 2));

// Calculate total inventory value
const totalValue = inventory.reduce((sum, item) => {
    const price = parseFloat(item.Price.replace('$', ''));
    const stock = parseInt(item.Stock);
    return sum + price * stock;
}, 0);
console.log(`\nTotal inventory value: $${totalValue.toFixed(2)}`);

console.log('\n\n=== End of Examples ===');
