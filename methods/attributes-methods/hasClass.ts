import type { JQ } from '../../types';

/**
 * Checks if the first element has the specified class.
 * @see https://api.jquery.com/hasClass/
 */
function hasClass(this: JQ, className: string): boolean {
    if (this.nodes.length === 0) {
        return false;
    }

    const element = this.nodes[0];

    if (element._originalElement) {
        const classNameValue = element._originalElement.className || '';
        const classes = classNameValue.split(/\s+/).filter((cls: string) => cls.length > 0);
        return classes.includes(className);
    }

    const classValue = element.getAttribute('class');
    if (!classValue) {
        return false;
    }

    const classes = classValue.split(/\s+/);
    return classes.includes(className);
}

export default hasClass;
