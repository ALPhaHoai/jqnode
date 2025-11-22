import { getTextContent } from '../../utils';
import type { HtmlNode, JQ } from '../../types';

interface ToJSONOptions {
    ignoreColumns?: number[];
    onlyColumns?: number[] | null;
    headings?: string | null;
    normalizeKeys?: boolean;
}

/**
 * Converts HTML table elements to JSON data (array of objects).
 * Each object represents a row with properties from table headers.
 */
function toJSON(this: JQ, options: ToJSONOptions = {}): Array<Record<string, string>> {
    const { ignoreColumns = [], onlyColumns = null, normalizeKeys = false } = options;
    const results: Array<Record<string, string>> = [];

    this.nodes.forEach((tableNode: HtmlNode) => {
        const tagName = tableNode.name?.toLowerCase();
        if (tableNode.type !== 'element' || tagName !== 'table') {
            return;
        }

        // Find headers
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

        // If no headers in thead, use first row
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

        // Extract header names
        const headers = headerCells.map((cell, index) => {
            if (ignoreColumns.includes(index)) return null;
            if (onlyColumns && !onlyColumns.includes(index)) return null;
            return getTextContent(cell).trim() || `column_${index}`;
        });

        // Find data rows
        let dataRows: HtmlNode[] = [];
        const tbody = tableNode.children?.find(child =>
            child.type === 'element' && child.name?.toLowerCase() === 'tbody');

        if (tbody) {
            // If tbody exists, get all rows from it
            dataRows = tbody.children?.filter(child =>
                child.type === 'element' && child.name?.toLowerCase() === 'tr') || [];
        } else {
            // If no tbody, get all rows except the first one (which we used as headers)
            const allRows = tableNode.children?.filter(child =>
                child.type === 'element' && child.name?.toLowerCase() === 'tr') || [];
            dataRows = allRows.slice(1); // Skip first row (headers)
        }

        // Convert rows to objects
        dataRows.forEach(row => {
            const cells = row.children?.filter(child => {
                const childTag = child.name?.toLowerCase();
                return child.type === 'element' && (childTag === 'td' || childTag === 'th');
            }) || [];

            const rowData: Record<string, string> = {};
            cells.forEach((cell, index) => {
                const header = headers[index];
                if (header !== null && header !== undefined) {
                    const key = normalizeKeys ? header.replace(/[^a-zA-Z0-9]/g, "_") : header;
                    rowData[key] = getTextContent(cell).trim();
                }
            });

            // Only add row if it has data
            if (Object.keys(rowData).length > 0) {
                results.push(rowData);
            }
        });
    });

    return results;
}

export = toJSON;
