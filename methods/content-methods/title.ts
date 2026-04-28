import type { JQ } from '../../types';

/**
 * Gets the document title by finding the <title> element within <head>.
 *
 * Note: This is not a jQuery method. This is a custom jqnode method.
 */
function title(this: JQ): string {
    // Use the find method to search for "head > title" within current nodes
    const titleElement = this.find('title');
    if (titleElement.nodes.length === 0) {
        return '';
    }
    const textResult = titleElement.text();
    // Handle GetterSetterReturn type - ensure we have a string
    if (typeof textResult === 'string') {
        return textResult.trim();
    }
    return '';
}

export default title;
