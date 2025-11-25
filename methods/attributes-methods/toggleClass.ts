import type { JqElement, JQ, ClassNameInput } from '../../types';

/**
 * Adds or removes one or more classes from each element, depending on the class's presence or the state argument.
 * @see https://api.jquery.com/toggleClass/
 */
function toggleClass(this: JQ, className: ClassNameInput, state?: boolean): JQ {
    this.nodes.forEach((element: JqElement) => {
        if (!element) return;

        const originalClass = element.getAttribute('class') || '';
        const currentClasses = originalClass.split(/\s+/).filter((cls: string) => cls.length > 0);
        let classNameStr = className;

        if (typeof className === 'function') {
            const index = Array.prototype.indexOf.call(this.nodes, element);
            const result = className.call(element, index, originalClass);
            if (typeof result === 'string') {
                classNameStr = result;
            } else {
                return;
            }
        }

        const classesToToggle = (classNameStr as string)
            .split(/\s+/)
            .filter((cls: string) => cls.length > 0);

        classesToToggle.forEach((cls: string) => {
            const classIndex = currentClasses.indexOf(cls);

            if (state === true) {
                if (classIndex === -1) {
                    currentClasses.push(cls);
                }
            } else if (state === false) {
                if (classIndex !== -1) {
                    currentClasses.splice(classIndex, 1);
                }
            } else {
                if (classIndex === -1) {
                    currentClasses.push(cls);
                } else {
                    currentClasses.splice(classIndex, 1);
                }
            }
        });

        const newClass = currentClasses.join(' ');
        element.setAttribute('class', newClass);

        if (element._originalElement) {
            element._originalElement.className = newClass;
        }
    });

    return this;
}

export default toggleClass;
