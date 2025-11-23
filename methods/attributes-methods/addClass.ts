import type { HtmlNode, JQ, ClassNameInput } from '../../types';

/**
 * Adds one or more classes to each element.
 */
function addClass(
    this: JQ,
    className: ClassNameInput
): JQ {
    if (typeof className === 'function') {
        this.nodes.forEach((element: HtmlNode, index: number) => {
            if (!element || !element.attributes) return;

            const originalClass = (element.attributes.class as string) || '';
            const result = className.call(element, index, originalClass);
            if (typeof result === 'string') {
                applyClassToElement(element, result);
            }
        });
        return this;
    }

    this.nodes.forEach((element: HtmlNode) => {
        applyClassToElement(element, className as string);
    });

    function applyClassToElement(element: HtmlNode, className: string) {
        if (!element || !element.attributes) return;

        if (!element.attributes.class) {
            element.attributes.class = '';
        }

        let currentClasses = ((element.attributes.class as string) || '').split(/\s+/).filter((cls: string) => cls.length > 0);
        const classesToAdd = className.split(/\s+/).filter((cls: string) => cls.length > 0);

        classesToAdd.forEach((cls: string) => {
            if (!currentClasses.includes(cls)) {
                currentClasses.push(cls);
            }
        });

        element.attributes.class = currentClasses.join(' ');

        if (element._originalElement) {
            element._originalElement.className = element.attributes.class as string;
        }
    }

    return this;
}

export = addClass;

