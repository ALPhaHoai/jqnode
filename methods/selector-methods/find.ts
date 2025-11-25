import { selectNodes } from '../../selector';
import type { CssSelector, JQ } from '../../types';
import JQClass from '../../jq';

/**
 * Finds descendant elements by CSS selector or tag name.
 * @see https://api.jquery.com/find/
 */
function find(this: JQ, selector: CssSelector): JQ {
    const selectedNodes = selectNodes(this.nodes, selector);
    const result = new JQClass(selectedNodes) as JQ;
    result._prevObject = this;
    return result;
}

export default find;
