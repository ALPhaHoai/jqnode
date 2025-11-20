/**
 * Adds one or more classes to each element.
 * @see https://api.jquery.com/addClass/
 * @param {string|Function} className - Class name(s) to add, or function returning class name(s)
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function addClass(className) {
    if (typeof className === 'function') {
        // For function parameters, we need to process each element individually
        this.nodes.forEach((element, index) => {
            if (!element || !element.attributes) return;

            // Get current class before any modifications
            const originalClass = element.attributes.class || '';

            // Call the function with index and current class
            const result = className.call(element, index, originalClass);
            if (typeof result === 'string') {
                // Apply the class for this specific element
                applyClassToElement(element, result);
            }
            // Skip if function doesn't return a string
        });
        return this;
    }

    // For string parameters, apply to all elements
    this.nodes.forEach(element => {
        applyClassToElement(element, className);
    });

    function applyClassToElement(element, className) {
        if (!element || !element.attributes) return;

        // Initialize class attribute if it doesn't exist
        if (!element.attributes.class) {
            element.attributes.class = '';
        }

        let currentClasses = element.attributes.class.split(/\s+/).filter(cls => cls.length > 0);

        const classesToAdd = className.split(/\s+/).filter(cls => cls.length > 0);

        classesToAdd.forEach(cls => {
            if (!currentClasses.includes(cls)) {
                currentClasses.push(cls);
            }
        });

        element.attributes.class = currentClasses.join(' ');

        // Update DOM element if it exists
        if (element._originalElement) {
            element._originalElement.className = element.attributes.class;
        }
    }

    return this;
};
