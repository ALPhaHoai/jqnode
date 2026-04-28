import type { JqElement, JQ, ClassNameInput } from '../../types';
import { parseClassString, getClassAttribute, setClassAttribute } from '../../helpers/class-utils';

/**
 * Adds or removes one or more classes from each element, depending on the class's presence or the state argument.
 * @see https://api.jquery.com/toggleClass/
 */
function toggleClass(this: JQ, className: ClassNameInput, state?: boolean): JQ {
    this.nodes.forEach((element: JqElement) => {
        if (!element) return;

        const originalClass = getClassAttribute(element);
        const currentClasses = parseClassString(originalClass);
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

        const classesToToggle = parseClassString(classNameStr as string);

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

        setClassAttribute(element, currentClasses);
    });

    return this;
}

export default toggleClass;
