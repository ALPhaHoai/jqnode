import type { JQ } from '../../types';

/**
 * Checks if the first element has the specified class.
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

    if (!element.attributes || !element.attributes.class) {
        return false;
    }

    const classes = (element.attributes.class as string).split(/\s+/);
    return classes.includes(className);
}

export = hasClass;
