/**
 * Removes one or more classes from each element.
 * @see https://api.jquery.com/removeClass/
 * @param {string|Function} className - Class name(s) to remove, or function returning class name(s)
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function removeClass(className) {
    if (typeof className === 'function') {
        // For function parameters, jQuery calls the function for each element with the class value
        // from element.getAttribute('class'), not from a cached value.
        // This means if the DOM is modified between elements in the same removeClass call,
        // each element sees the current DOM state, not the initial state.
        this.nodes.forEach((element, index) => {
            if (!element || !element.attributes) return;

            // Sync internal attributes FROM DOM first, to ensure we see any external changes
            if (element._originalElement) {
                element.attributes.class = element._originalElement.className || '';
            }

            // Read the current class
            const currentClass = element.attributes.class || '';

            // Call the function with index and current class
            const result = className.call(element, index, currentClass);
            if (typeof result === 'string') {
                applyRemoveClassToElement(element, result, true);
            }
        });

        return this;
    }

    // For string parameters or no parameter, apply to all elements
    this.nodes.forEach(element => {
        applyRemoveClassToElement(element, className, true);
    });

    function applyRemoveClassToElement(element, className, syncToDOM = true) {
        if (!element || !element.attributes) return;

        // Initialize class attribute if it doesn't exist
        if (!element.attributes.class) {
            element.attributes.class = '';
        }

        let currentClasses = element.attributes.class.split(/\s+/).filter(cls => cls.length > 0);

        // If no className provided, remove all classes
        if (className === undefined || className === null) {
            currentClasses = [];
        } else {
            const classesToRemove = className.split(/\s+/).filter(cls => cls.length > 0);

            classesToRemove.forEach(cls => {
                const classIndex = currentClasses.indexOf(cls);
                if (classIndex !== -1) {
                    currentClasses.splice(classIndex, 1);
                }
            });
        }

        element.attributes.class = currentClasses.join(' ');

        // Update DOM element if it exists AND syncToDOM is true
        if (syncToDOM && element._originalElement) {
            element._originalElement.className = element.attributes.class;
        }
    }

    return this;
};
