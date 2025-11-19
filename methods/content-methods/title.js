/**
 * Gets the document title by finding the <title> element within <head>.
 * This method searches within the current JQ instance's nodes for a title element.
 * @see Similar to accessing document.title in the browser
 * @returns {string} The text content of the title element, trimmed, or empty string if not found
 */
module.exports = function title() {
    // Use the find method to search for "head > title" within current nodes
    // This works whether we have the full HTML document or just a portion
    const titleElement = this.find("head > title");

    // Get the text content and trim it
    return titleElement.text().trim();
};
