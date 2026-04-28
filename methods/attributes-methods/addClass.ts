import type { JqElement, JQ, ClassNameInput } from '../../types';
import { parseClassString, addClassesToElement } from '../../helpers/class-utils';

/**
 * Adds one or more classes to each element.
 * @see https://api.jquery.com/addClass/
 */
function addClass(this: JQ, className: ClassNameInput): JQ {
    if (typeof className === 'function') {
        this.nodes.forEach((element: JqElement, index: number) => {
            const originalClass = element.getAttribute('class') || '';
            const result = className.call(element, index, originalClass);
            if (typeof result === 'string') {
                applyClassToElement(element, result);
            }
        });
        return this;
    }

    this.nodes.forEach((element: JqElement) => {
        applyClassToElement(element, className as string);
    });

    function applyClassToElement(element: JqElement, className: string) {
        if (!element) return;
        const classesToAdd = parseClassString(className);
        addClassesToElement(element, classesToAdd);
    }

    return this;
}

export default addClass;
