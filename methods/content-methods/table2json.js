const { getTextContent } = require('../../utils');

/**
 * Converts HTML table elements to JSON data (array of objects).
 * Each object represents a row with properties from table headers.
 * @see Similar to jQuery table2json plugins
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.ignoreColumns] - Array of column indices to ignore (0-based)
 * @param {boolean} [options.onlyColumns] - Array of column indices to include (0-based)
 * @param {string} [options.headings] - Selector for custom heading elements (defaults to thead th/td or first tr)
 * @returns {Array} Array of objects representing table rows
 */
module.exports = function table2json(options = {}) {
    const { ignoreColumns = [], onlyColumns = null, headings = null } = options;
    const results = [];

    this.nodes.forEach(tableNode => {
        const tagName = tableNode.tagName?.toLowerCase();
        if (tableNode.type !== 'element' || tagName !== 'table') {
            return;
        }

        // Find headers
        let headerCells = [];

        // Try to find headers in <thead>
        const thead = tableNode.children?.find(child =>
            child.type === 'element' && child.tagName?.toLowerCase() === 'thead');
        if (thead) {
            const theadRow = thead.children?.find(child =>
                child.type === 'element' && child.tagName?.toLowerCase() === 'tr');
            if (theadRow) {
                headerCells = theadRow.children?.filter(child => {
                    const childTag = child.tagName?.toLowerCase();
                    return child.type === 'element' && (childTag === 'th' || childTag === 'td');
                }) || [];
            }
        }

        // If no headers in thead, use first row
        if (headerCells.length === 0) {
            const tbody = tableNode.children?.find(child =>
                child.type === 'element' && child.tagName?.toLowerCase() === 'tbody');
            const rowContainer = tbody || tableNode;
            const firstRow = rowContainer.children?.find(child =>
                child.type === 'element' && child.tagName?.toLowerCase() === 'tr');
            if (firstRow) {
                headerCells = firstRow.children?.filter(child => {
                    const childTag = child.tagName?.toLowerCase();
                    return child.type === 'element' && (childTag === 'th' || childTag === 'td');
                }) || [];
            }
        }

        // Extract header names
        const headers = headerCells.map((cell, index) => {
            if (ignoreColumns.includes(index)) return null;
            if (onlyColumns && !onlyColumns.includes(index)) return null;
            return getTextContent(cell).trim() || `column_${index}`;
        });

        // Find data rows
        let dataRows = [];
        const tbody = tableNode.children?.find(child =>
            child.type === 'element' && child.tagName?.toLowerCase() === 'tbody');

        if (tbody) {
            // If tbody exists, get all rows from it
            dataRows = tbody.children?.filter(child =>
                child.type === 'element' && child.tagName?.toLowerCase() === 'tr') || [];
        } else {
            // If no tbody, get all rows except the first one (which we used as headers)
            const allRows = tableNode.children?.filter(child =>
                child.type === 'element' && child.tagName?.toLowerCase() === 'tr') || [];
            dataRows = allRows.slice(1); // Skip first row (headers)
        }

        // Convert rows to objects
        dataRows.forEach(row => {
            const cells = row.children?.filter(child => {
                const childTag = child.tagName?.toLowerCase();
                return child.type === 'element' && (childTag === 'td' || childTag === 'th');
            }) || [];

            const rowData = {};
            cells.forEach((cell, index) => {
                const header = headers[index];
                if (header !== null && header !== undefined) {
                    rowData[header] = getTextContent(cell).trim();
                }
            });

            // Only add row if it has data
            if (Object.keys(rowData).length > 0) {
                results.push(rowData);
            }
        });
    });

    return results;
};
