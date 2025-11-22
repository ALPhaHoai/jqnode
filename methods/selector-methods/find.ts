import { selectNodes } from '../../selector';
import type { CssSelector, JQ } from '../../types';

/**
 * Finds descendant elements by CSS selector or tag name.
 */
function find(this: JQ, selector: CssSelector): JQ {
    const selectedNodes = selectNodes(this.nodes, selector);
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = selectedNodes;
    result.length = selectedNodes.length;
    result._prevObject = this;
    return result;
}

export = find;
