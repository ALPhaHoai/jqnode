import type { JqElement, JQ, ClassNameInput } from '../../types';
import { parseClassString, removeClassesFromElement, setClassAttribute } from '../../helpers/class-utils';

/**
 * Removes one or more classes from each element.
 * @see https://api.jquery.com/removeClass/
 */
function removeClass(this: JQ, className?: ClassNameInput): JQ {
    if (typeof className === 'function') {
        this.nodes.forEach((element: JqElement, index: number) => {
            if (!element) return;

            const currentClass = element.getAttribute('class') || '';
            const result = className.call(element, index, currentClass);
            if (typeof result === 'string') {
                applyRemoveClassToElement(element, result, true);
            }
        });

        return this;
    }

    this.nodes.forEach((element: JqElement) => {
        // CRITICAL: Read from _originalElement.className if it exists (source of truth for DOM)
        // This ensures we see changes made by jQuery or other libraries
        if (element && element._originalElement) {
            const domClass = element._originalElement.className || '';
            element.setAttribute('class', domClass);
        }
        applyRemoveClassToElement(element, className, true);
    });

    function applyRemoveClassToElement(
        element: JqElement,
        className?: string,
        syncToDOM: boolean = true,
    ) {
        if (!element) return;

        if (className === undefined || className === null) {
            setClassAttribute(element, [], syncToDOM);
        } else {
            const classesToRemove = parseClassString(className);
            removeClassesFromElement(element, classesToRemove, syncToDOM);
        }
    }

    return this;
}

export default removeClass;
