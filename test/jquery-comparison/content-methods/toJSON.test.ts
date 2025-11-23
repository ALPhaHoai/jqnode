// Note: toJSON() is a jqnode-specific feature for converting HTML tables to JSON
// jQuery does not have this method, so this test only validates the jqnode implementation
import $ from '../../../index';

describe('toJSON method - jqnode specific', () => {
    test('converts simple table to JSON', () => {
        const html = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                </tr>
                <tr>
                    <td>Alice</td>
                    <td>25</td>
                </tr>
                <tr>
                    <td>Bob</td>
                    <td>30</td>
                </tr>
            </table>
        `;
        const $table = $(html);
        const result = $table.toJSON();

        expect(result).toEqual([
            { Name: 'Alice', Age: '25' },
            { Name: 'Bob', Age: '30' },
        ]);
    });

    test('handles ignoreColumns option', () => {
        const html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Alice</td>
                </tr>
            </table>
        `;
        const $table = $(html);
        const result = $table.toJSON({ ignoreColumns: [0] });

        expect(result).toEqual([{ Name: 'Alice' }]);
    });
});
