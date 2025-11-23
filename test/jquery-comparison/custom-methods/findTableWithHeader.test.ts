/**
 * Tests for .findTableWithHeader() instance method
 */

import jq from '../../../index';

describe('.findTableWithHeader()', () => {
    beforeEach(() => {
        // Clear the root nodes registry before each test
        jq.clearRootNodesRegistry();
    });

    afterEach(() => {
        // Clean up after each test
        jq.clearRootNodesRegistry();
    });

    describe('Basic functionality', () => {
        it('should be accessible as an instance method', () => {
            const $html = jq('<html><body></body></html>');
            expect(typeof $html.findTableWithHeader).toBe('function');
        });

        it('should find table with a single matching header', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>John</td><td>john@example.com</td><td>30</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
            expect($tables.attr('id')).toBe('users');
        });

        it('should find table with multiple matching headers', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader(['Name', 'Email']);
            expect($tables.length).toBe(1);
            expect($tables.attr('id')).toBe('users');
        });

        it('should return empty result when header not found', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('Address');
            expect($tables.length).toBe(0);
        });

        it('should perform case-insensitive matching', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('name');
            expect($tables.length).toBe(1);
        });

        it('should support partial header matching', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email Address</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
        });
    });

    describe('Multiple tables', () => {
        it('should find only tables with matching headers', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                    </table>
                    <table id="products">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                    </table>
                    <table id="orders">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Name</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(2);

            // Check that we got users and orders tables
            const ids: string[] = [];
            $tables.each((i, node) => {
                ids.push(node.attributes!.id as string);
            });
            expect(ids.sort()).toEqual(['orders', 'users']);
        });

        it('should find tables with all required headers', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                    </table>
                    <table id="full-users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader(['Name', 'Email', 'Phone']);
            expect($tables.length).toBe(1);
            expect($tables.attr('id')).toBe('full-users');
        });
    });

    describe('Table structures', () => {
        it('should work with tables without thead using first row', () => {
            const html = `
                <table id="simple">
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td>John</td>
                        <td>30</td>
                    </tr>
                </table>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
            expect($tables.attr('id')).toBe('simple');
        });

        it('should work with tables with tbody but no thead', () => {
            const html = `
                <table id="tbody-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                        </tr>
                        <tr>
                            <td>John</td>
                            <td>30</td>
                        </tr>
                    </tbody>
                </table>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
        });

        it('should work with td elements as headers', () => {
            const html = `
                <table id="td-headers">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Age</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John</td>
                            <td>30</td>
                        </tr>
                    </tbody>
                </table>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
        });
    });

    describe('Edge cases', () => {
        it('should return empty result for empty header string', () => {
            const html = '<table><thead><tr><th>Name</th></tr></thead></table>';
            const $tables = jq(html).findTableWithHeader('');
            expect($tables.length).toBe(0);
        });

        it('should return empty result for empty header array', () => {
            const html = '<table><thead><tr><th>Name</th></tr></thead></table>';
            const $tables = jq(html).findTableWithHeader([]);
            expect($tables.length).toBe(0);
        });

        it('should handle whitespace in headers', () => {
            const html = `
                <table id="whitespace">
                    <thead>
                        <tr>
                            <th>  Name  </th>
                            <th>  Age  </th>
                        </tr>
                    </thead>
                </table>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
        });

        it('should handle empty tables', () => {
            const html = '<table id="empty"></table>';
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(0);
        });

        it('should handle tables with only data rows (no headers)', () => {
            const html = `
                <table id="no-headers">
                    <tr>
                        <td>John</td>
                        <td>30</td>
                    </tr>
                </table>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(0);
        });
    });

    describe('Descendant table search', () => {
        it('should find tables in descendants', () => {
            const html = `
                <div id="container">
                    <div class="section">
                        <table id="nested">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            `;
            const $tables = jq(html).findTableWithHeader('Name');
            expect($tables.length).toBe(1);
            expect($tables.attr('id')).toBe('nested');
        });

        it('should work when called on a table element itself', () => {
            const html = `
                <table id="direct">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                </table>
            `;
            const $table = jq(html);
            const $found = $table.findTableWithHeader('Name');
            expect($found.length).toBe(1);
            expect($found.attr('id')).toBe('direct');
        });

        it('should deduplicate tables found in current nodes and descendants', () => {
            const html = `
                <table id="parent">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                </table>
            `;
            const $table = jq(html);
            const $found = $table.findTableWithHeader('Name');
            // Should only find the table once, not duplicated
            expect($found.length).toBe(1);
        });
    });

    describe('Chaining', () => {
        it('should support method chaining', () => {
            const html = `
                <div>
                    <table id="users" class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John</td>
                                <td>john@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            const hasClass = jq(html).findTableWithHeader('Name').hasClass('table');
            expect(hasClass).toBe(true);
        });

        it('should work with other methods', () => {
            const html = `
                <div>
                    <table id="users">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John</td>
                                <td>john@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            const data = jq(html).findTableWithHeader('Name').toJSON();
            expect(data).toEqual([
                {
                    Name: 'John',
                    Email: 'john@example.com',
                },
            ]);
        });
    });
});
