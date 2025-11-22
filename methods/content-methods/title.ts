import type { JQ } from '../../types';

/**
 * Gets the document title by finding the <title> element within <head>.
 */
function title(this: JQ): string {
    // Use the find method to search for "head > title" within current nodes
    const titleElement = this.find("head > title");

    // Get the text content and trim it
    return titleElement.text().trim();
}

export = title;
