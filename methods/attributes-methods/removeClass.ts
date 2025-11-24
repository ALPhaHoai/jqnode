import type { HtmlNode, JQ, ClassNameInput } from '../../types';

/**
 * Removes one or more classes from each element.
 * @see https://api.jquery.com/removeClass/
 */
function removeClass(this: JQ, className?: ClassNameInput): JQ {
    if (typeof className === 'function') {
        this.nodes.forEach((element: HtmlNode, index: number) => {
            if (!element) return;

            const currentClass = element.getAttribute('class') || '';
            const result = className.call(element, index, currentClass);
            if (typeof result === 'string') {
                applyRemoveClassToElement(element, result, true);
            }
        });

        return this;
    }

    this.nodes.forEach((element: HtmlNode) => {
        // CRITICAL: Read from _originalElement.className if it exists (source of truth for DOM)
        // This ensures we see changes made by jQuery or other libraries
        if (element && element._originalElement) {
            const domClass = element._originalElement.className || '';
            element.setAttribute('class', domClass);
        }
        applyRemoveClassToElement(element, className, true);
    });

    function applyRemoveClassToElement(
        element: HtmlNode,
        className?: string,
        syncToDOM: boolean = true,
    ) {
        if (!element) return;

        const currentClass = element.getAttribute('class') || '';
        let currentClasses = currentClass.split(/\s+/).filter((cls: string) => cls.length > 0);

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

        const newClass = currentClasses.join(' ');
        element.setAttribute('class', newClass);

        if (syncToDOM && element._originalElement) {
            element._originalElement.className = newClass;
        }
    }

    return this;
}

export = removeClass;
