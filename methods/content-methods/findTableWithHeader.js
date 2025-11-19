const { getTextContent } = require('../../utils');

/**
 * Finds table elements that contain specific headers.
 * Checks both the current nodes (if they are tables) and descendant tables.
 * @param {string|Array<string>} headers - The header(s) to look for.
 * @returns {JQ} New JQ instance with matching table elements
 */
module.exports = function findTableWithHeader(headers) {
    const targetHeaders = (Array.isArray(headers) ? headers : [headers])
        .map(h => String(h).toLowerCase().trim())
        .filter(h => h.length > 0); // Filter out empty strings

    if (targetHeaders.length === 0) {
        return new this.constructor([]);
    }

    // 1. Identify all candidate tables (current nodes + descendants)
    const candidateTables = [];

    // Check current nodes
    this.nodes.forEach(node => {
        if (node.type === 'element' && node.tagName && node.tagName.toLowerCase() === 'table') {
            candidateTables.push(node);
        }
    });

    // Check descendants
    // We use this.find('table') to get descendants. 
    const descendantTables = this.find('table');
    descendantTables.nodes.forEach(node => {
        candidateTables.push(node);
    });

    // Deduplicate
    const uniqueTables = [...new Set(candidateTables)];

    const matchingTables = uniqueTables.filter(tableNode => {
        // Extract headers from this table
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

        // If no headers in thead, use first row of tbody or table
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

        // Get text content of headers
        const tableHeaders = headerCells.map(cell => getTextContent(cell).trim().toLowerCase());

        // Check if ALL target headers are present (partial match allowed)
        // For each target header, there must be at least one table header that contains it.
        return targetHeaders.every(target =>
            tableHeaders.some(tableHeader => tableHeader.includes(target))
        );
    });

    return new this.constructor(matchingTables);
};
