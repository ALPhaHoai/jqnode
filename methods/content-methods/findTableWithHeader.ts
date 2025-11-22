import { getTextContent } from '../../utils';
import type { HtmlNode, JQ } from '../../types';

/**
 * Finds table elements that contain specific headers.
 * Checks both the current nodes (if they are tables) and descendant tables.
 */
function findTableWithHeader(this: JQ, headers: string | string[]): JQ {
    const targetHeaders = (Array.isArray(headers) ? headers : [headers])
        .map(h => String(h).toLowerCase().trim())
        .filter(h => h.length > 0); // Filter out empty strings

    if (targetHeaders.length === 0) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        result.length = 0;
        return result;
    }

    // 1. Identify all candidate tables (current nodes + descendants)
    const candidateTables: HtmlNode[] = [];

    // Check current nodes
    this.nodes.forEach((node: HtmlNode) => {
        if (node.type === 'element' && node.name && node.name.toLowerCase() === 'table') {
            candidateTables.push(node);
        }
    });

    // Check descendants
    const descendantTables = this.find('table');
    descendantTables.nodes.forEach((node: HtmlNode) => {
        candidateTables.push(node);
    });

    // Deduplicate
    const uniqueTables = [...new Set(candidateTables)];

    const matchingTables = uniqueTables.filter(tableNode => {
        // Extract headers from this table
        let headerCells: HtmlNode[] = [];

        // Try to find headers in <thead>
        const thead = tableNode.children?.find(child =>
            child.type === 'element' && child.name?.toLowerCase() === 'thead');

        if (thead) {
            const theadRow = thead.children?.find(child =>
                child.type === 'element' && child.name?.toLowerCase() === 'tr');
            if (theadRow) {
                headerCells = theadRow.children?.filter(child => {
                    const childTag = child.name?.toLowerCase();
                    return child.type === 'element' && (childTag === 'th' || childTag === 'td');
                }) || [];
            }
        }

        // If no headers in thead, use first row of tbody or table
        if (headerCells.length === 0) {
            const tbody = tableNode.children?.find(child =>
                child.type === 'element' && child.name?.toLowerCase() === 'tbody');
            const rowContainer = tbody || tableNode;
            const firstRow = rowContainer.children?.find(child =>
                child.type === 'element' && child.name?.toLowerCase() === 'tr');
            if (firstRow) {
                headerCells = firstRow.children?.filter(child => {
                    const childTag = child.name?.toLowerCase();
                    return child.type === 'element' && (childTag === 'th' || childTag === 'td');
                }) || [];
            }
        }

        // Get text content of headers
        const tableHeaders = headerCells.map(cell => getTextContent(cell).trim().toLowerCase());

        // Check if ALL target headers are present (partial match allowed)
        return targetHeaders.every(target =>
            tableHeaders.some(tableHeader => tableHeader.includes(target))
        );
    });

    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = matchingTables;
    result.length = matchingTables.length;
    return result;
}

export = findTableWithHeader;
