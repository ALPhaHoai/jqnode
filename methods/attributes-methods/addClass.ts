import type { JqElement, JQ, ClassNameInput } from '../../types';

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

        const currentClass = element.getAttribute('class') || '';
        const currentClasses = currentClass.split(/\s+/).filter((cls: string) => cls.length > 0);
        const classesToAdd = className.split(/\s+/).filter((cls: string) => cls.length > 0);

        classesToAdd.forEach((cls: string) => {
            if (!currentClasses.includes(cls)) {
                currentClasses.push(cls);
            }
        });

        const newClass = currentClasses.join(' ');
        element.setAttribute('class', newClass);

        if (element._originalElement) {
            element._originalElement.className = newClass;
        }
    }

    return this;
}

export = addClass;
