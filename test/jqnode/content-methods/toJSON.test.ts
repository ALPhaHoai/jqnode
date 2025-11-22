import jq from '../../../index';

describe('toJSON', () => {
    test('converts simple table to JSON', () => {
        const html = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>City</th>
                </tr>
                <tr>
                    <td>Alice</td>
                    <td>25</td>
                    <td>New York</td>
                </tr>
                <tr>
                    <td>Bob</td>
                    <td>30</td>
                    <td>London</td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { Name: 'Alice', Age: '25', City: 'New York' },
            { Name: 'Bob', Age: '30', City: 'London' }
        ]);
    });

    test('converts table with thead and tbody', () => {
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Apple</td>
                        <td>$1.00</td>
                    </tr>
                    <tr>
                        <td>Orange</td>
                        <td>$1.50</td>
                    </tr>
                </tbody>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { Product: 'Apple', Price: '$1.00' },
            { Product: 'Orange', Price: '$1.50' }
        ]);
    });

    test('handles table with empty headers', () => {
        const html = `
            <table>
                <tr>
                    <th></th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Row 1</td>
                    <td>100</td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { column_0: 'Row 1', Value: '100' }
        ]);
    });

    test('handles ignoreColumns option', () => {
        const html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Alice</td>
                    <td>Active</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Bob</td>
                    <td>Inactive</td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON({ ignoreColumns: [0] });

        expect(result).toEqual([
            { Name: 'Alice', Status: 'Active' },
            { Name: 'Bob', Status: 'Inactive' }
        ]);
    });

    test('handles onlyColumns option', () => {
        const html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Alice</td>
                    <td>alice@example.com</td>
                    <td>25</td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON({ onlyColumns: [1, 2] });

        expect(result).toEqual([
            { Name: 'Alice', Email: 'alice@example.com' }
        ]);
    });

    test('handles multiple tables', () => {
        const html = `
            <div>
                <table>
                    <tr><th>A</th></tr>
                    <tr><td>1</td></tr>
                </table>
                <table>
                    <tr><th>B</th></tr>
                    <tr><td>2</td></tr>
                </table>
            </div>
        `;
        const $tables = jq(html).find('table');
        const result = $tables.toJSON();

        expect(result).toEqual([
            { A: '1' },
            { B: '2' }
        ]);
    });

    test('handles table with no data rows', () => {
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([]);
    });

    test('returns empty array for non-table elements', () => {
        const html = '<div>Not a table</div>';
        const $div = jq(html);
        const result = $div.toJSON();

        expect(result).toEqual([]);
    });

    test('handles nested data in cells', () => {
        const html = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td>Alice</td>
                    <td><span>Engineer</span> at <strong>TechCo</strong></td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { Name: 'Alice', Details: 'Engineer at TechCo' }
        ]);
    });

    test('trims whitespace from cells', () => {
        const html = `
            <table>
                <tr>
                    <th>  Name  </th>
                    <th>Age</th>
                </tr>
                <tr>
                    <td>  Alice  </td>
                    <td>  25  </td>
                </tr>
            </table>
        `;
        const $table = jq(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { Name: 'Alice', Age: '25' }
        ]);
    });
});
