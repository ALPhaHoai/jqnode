import type { HtmlNode, JQ, ClassNameInput } from '../../types';

/**
 * Removes one or more classes from each element.
 */
function removeClass(
    this: JQ,
    className?: ClassNameInput
): JQ {
    if (typeof className === 'function') {
        this.nodes.forEach((element: HtmlNode, index: number) => {
            if (!element || !element.attribs) return;

            if (element._originalElement) {
                element.attribs.class = element._originalElement.className || '';
            }

            const currentClass = element.attribs.class || '';
            const result = className.call(element, index, currentClass);
            if (typeof result === 'string') {
                applyRemoveClassToElement(element, result, true);
            }
        });

        return this;
    }

    this.nodes.forEach((element: HtmlNode) => {
        applyRemoveClassToElement(element, className, true);
    });

    function applyRemoveClassToElement(element: HtmlNode, className?: string, syncToDOM: boolean = true) {
        if (!element || !element.attribs) return;

        if (!element.attribs.class) {
            element.attribs.class = '';
        }

        let currentClasses = element.attribs.class.split(/\s+/).filter((cls: string) => cls.length > 0);

        if (className === undefined || className === null) {
            currentClasses = [];
        } else {
            const classesToRemove = className.split(/\s+/).filter((cls: string) => cls.length > 0);

            classesToRemove.forEach((cls: string) => {
                const classIndex = currentClasses.indexOf(cls);
                if (classIndex !== -1) {
                    currentClasses.splice(classIndex, 1);
                }
            });
        }

        element.attribs.class = currentClasses.join(' ');

        if (syncToDOM && element._originalElement) {
            element._originalElement.className = element.attribs.class;
        }
    }

    return this;
}

export = removeClass;

