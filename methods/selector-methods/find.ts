import { selectNodes } from '../../selector';
import type { CssSelector, JQ } from '../../types';

/**
 * Finds descendant elements by CSS selector or tag name.
 * @see https://api.jquery.com/find/
 */
function find(this: JQ, selector: CssSelector): JQ {
    const selectedNodes = selectNodes(this.nodes, selector);
    return this.pushStack(selectedNodes);
}

export default find;
