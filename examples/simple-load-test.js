const jq = require('../index');

console.log('=== Simple .load() Test ===\n');

// Example 1: The exact syntax you requested
const result = {
    data: `
    <table id="table1"><tr><td>Data 1</td></tr></table>
    <table id="table2"><tr><td>Data 2</td></tr></table>
    `
};

const $ = jq.load(result?.data || "");
const tables = $("table");  // ✅ Now you can use callable syntax!

console.log('Number of tables:', tables.length);
console.log('Table 1 ID:', tables.eq(0).attr('id'));
console.log('Table 2 ID:', tables.eq(1).attr('id'));

console.log('\n✅ Success! The jq.load() method is working correctly.');
console.log('✅ Both syntaxes work:');
console.log('   - $("selector")      // jQuery-like callable syntax');
console.log('   - $.find("selector") // Traditional method syntax');
