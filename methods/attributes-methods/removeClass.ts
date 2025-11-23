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
            if (!element || !element.attributes) return;

            if (element._originalElement) {
                element.attributes.class = element._originalElement.className || '';
            }

            const currentClass = (element.attributes.class as string) || '';
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
        if (element && element.attributes && element._originalElement) {
            element.attributes.class = element._originalElement.className || '';
        }
        applyRemoveClassToElement(element, className, true);
    });

    function applyRemoveClassToElement(element: HtmlNode, className?: string, syncToDOM: boolean = true) {
        if (!element || !element.attributes) return;

        if (!element.attributes.class) {
            element.attributes.class = '';
        }

        let currentClasses = ((element.attributes.class as string) || '').split(/\s+/).filter((cls: string) => cls.length > 0);

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

        element.attributes.class = currentClasses.join(' ');

        if (syncToDOM && element._originalElement) {
            element._originalElement.className = element.attributes.class as string;
        }
    }

    return this;
}

export = removeClass;

