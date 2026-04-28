import { getTextContent } from '../../utils';
import type { JqElement, JQ } from '../../types';
import JQClass from '../../jq';

/**
 * Finds table elements that contain specific headers.
 * Checks both the current nodes (if they are tables) and descendant tables.
 *
 * Note: This is not a jQuery method. This is a custom jqnode method.
 */
function findTableWithHeader(this: JQ, headers: string | string[]): JQ {
    const targetHeaders = (Array.isArray(headers) ? headers : [headers])
        .map((h) => String(h).toLowerCase().trim())
        .filter((h) => h.length > 0); // Filter out empty strings

    if (targetHeaders.length === 0) {
        const JQClass = this.constructor as any;
        const result = new JQClass([]);
        return result;
    }

    // 1. Identify all candidate tables (current nodes + descendants)
    const candidateTables: JqElement[] = [];

    // Check current nodes
    this.nodes.forEach((node: JqElement) => {
        if (node.internalType === 'element' && node.tagName && node.tagName.toLowerCase() === 'table') {
            candidateTables.push(node);
        }
    });

    // Check descendants
    const descendantTables = this.find('table');
    descendantTables.nodes.forEach((node: JqElement) => {
        candidateTables.push(node);
    });

    // Deduplicate
    const uniqueTables = [...new Set(candidateTables)];

    const matchingTables = uniqueTables.filter((tableNode) => {
        // Extract headers from this table
        let headerCells: JqElement[] = [];

        // Try to find headers in <thead>
        const thead = tableNode.children?.find(
            (child) => child.internalType === 'element' && child.tagName?.toLowerCase() === 'thead',
        );

        if (thead) {
            const theadRow = thead.children?.find(
                (child) => child.internalType === 'element' && child.tagName?.toLowerCase() === 'tr',
            );
            if (theadRow) {
                headerCells =
                    theadRow.children?.filter((child) => {
                        const childTag = child.tagName?.toLowerCase();
                        return child.internalType === 'element' && (childTag === 'th' || childTag === 'td');
                    }) || [];
            }
        }

        // If no headers in thead, use first row of tbody or table
        if (headerCells.length === 0) {
            const tbody = tableNode.children?.find(
                (child) => child.internalType === 'element' && child.tagName?.toLowerCase() === 'tbody',
            );
            const rowContainer = tbody || tableNode;
            const firstRow = rowContainer.children?.find(
                (child) => child.internalType === 'element' && child.tagName?.toLowerCase() === 'tr',
            );
            if (firstRow) {
                headerCells =
                    firstRow.children?.filter((child) => {
                        const childTag = child.tagName?.toLowerCase();
                        return child.internalType === 'element' && (childTag === 'th' || childTag === 'td');
                    }) || [];
            }
        }

        // Get text content of headers
        const tableHeaders = headerCells.map((cell) => getTextContent(cell).trim().toLowerCase());

        // Check if ALL target headers are present (partial match allowed)
        return targetHeaders.every((target) =>
            tableHeaders.some((tableHeader) => tableHeader.includes(target)),
        );
    });

    return new JQClass(matchingTables);
}

export default findTableWithHeader;
