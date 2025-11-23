import type { HtmlNode, JQ, IndexTarget } from '../../types';

/**
 * Search for a given element from among the matched elements.
 * @see https://api.jquery.com/index/
 */
function index(this: JQ, arg?: IndexTarget): number {
    // Case 1: No argument - return index of first element among its siblings
    if (arg === undefined) {
        const first: HtmlNode = this.nodes[0];
        if (!first) return -1;

        const parent = first.parent || first.parentNode;
        if (!parent) return -1;

        // Get siblings based on node type
        let siblings: HtmlNode[] = [];
        if (parent.children) {
            // Internal nodes or DOM Element.children (HTMLCollection or array-like)
            siblings = Array.from(parent.children as unknown as ArrayLike<HtmlNode>) as HtmlNode[];
            // Filter to ensure only elements are counted
            siblings = siblings.filter((n: HtmlNode) => n.nodeType === 1 || n.type === 'element');
        } else if (parent.childNodes) {
            // DOM nodes fallback
            siblings = (Array.from(parent.childNodes) as Node[]).filter(
                (n: Node) => n.nodeType === 1,
            ) as unknown as HtmlNode[];
        } else {
            return -1;
        }

        return siblings.indexOf(first);
    }

    // Case 2: Argument is a string (selector)
    if (typeof arg === 'string') {
        const first: HtmlNode = this.nodes[0];
        if (!first) return -1;

        try {
            let allMatches: HtmlNode[] = [];

            // Try to use internal selector engine first
            const roots = (this.constructor as { allRootNodes?: HtmlNode[] }).allRootNodes || [];

            if (roots.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { selectNodes } = require('../../selector');
                roots.forEach((root: HtmlNode) => {
                    const matches = selectNodes([root], arg);
                    allMatches = allMatches.concat(matches);
                });
            }

            // If no matches found and we're in browser, try document.querySelectorAll
            if (allMatches.length === 0 && typeof document !== 'undefined') {
                const matches = document.querySelectorAll(arg);
                allMatches = Array.from(matches) as unknown as HtmlNode[];
            }

            const target = first._originalElement || first;
            return allMatches.findIndex((match) => {
                return (
                    match === target ||
                    match === first ||
                    (match._originalElement && match._originalElement === target)
                );
            });
        } catch (e) {
            return -1;
        }
    }

    // Case 3: Argument is a DOM element or JQ object
    let target: HtmlNode | JQ = arg as any;
    if (target instanceof this.constructor) {
        target = (target as JQ).nodes[0];
    }

    // If target is a JQ node, it might have _originalElement
    const targetElem = (target as HtmlNode)._originalElement || target;

    return this.nodes.findIndex((node: HtmlNode) => {
        return (
            node === target ||
            node === targetElem ||
            (node._originalElement && node._originalElement === targetElem)
        );
    });
}

export = index;
