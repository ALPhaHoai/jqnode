import type { HtmlNode, JQ } from '../../types';

/**
 * Retrieve all the elements contained in the jQuery set, as an array.
 */
function toArray(this: JQ): HtmlNode[] {
    return this.nodes.map((node: HtmlNode) => node._originalElement || node) as HtmlNode[];
}

export = toArray;
