import type { JqElement, JQ } from '../../types';

/**
 * Add a collection of DOM elements onto the jQuery stack.
 * @see https://api.jquery.com/pushStack/
 */
function pushStack(this: JQ, elements: JqElement[]): JQ {
    const ret = new (this.constructor as any)(elements);
    ret._prevObject = this;
    return ret;
}

export default pushStack;
