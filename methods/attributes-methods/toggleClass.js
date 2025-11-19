/**
 * Adds or removes one or more classes from each element, depending on either the class's presence or the value of the state argument.
 * @see https://api.jquery.com/toggleClass/
 * @param {string|Function} className - Class name(s) to toggle, or function returning class name(s)
 * @param {boolean} [state] - Boolean indicating whether to add (true) or remove (false) the class
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function toggleClass(className, state) {
    this.debugLog(`JQ.toggleClass: Toggling classes "${className}" with state ${state} on ${this.nodes.length} elements`);

    this.nodes.forEach(element => {
        if (!element || !element.attributes) return;

        // Get current class before any modifications for function parameter
        const originalClass = element.attributes.class || '';

        // Initialize class attribute if it doesn't exist
        if (!element.attributes.class) {
            element.attributes.class = '';
        }

        let currentClasses = element.attributes.class.split(/\s+/).filter(cls => cls.length > 0);

        if (typeof className === 'function') {
            // Handle function parameter - jQuery passes index and current class name
            const index = Array.prototype.indexOf.call(this.nodes, element);
            const result = className.call(element, index, originalClass);
            if (typeof result === 'string') {
                className = result;
            } else {
                return; // Skip if function doesn't return a string
            }
        }

        const classesToToggle = className.split(/\s+/).filter(cls => cls.length > 0);

        classesToToggle.forEach(cls => {
            const classIndex = currentClasses.indexOf(cls);

            if (state === true) {
                // Force add
                if (classIndex === -1) {
                    currentClasses.push(cls);
                }
            } else if (state === false) {
                // Force remove
                if (classIndex !== -1) {
                    currentClasses.splice(classIndex, 1);
                }
            } else {
                // Toggle
                if (classIndex === -1) {
                    currentClasses.push(cls);
                } else {
                    currentClasses.splice(classIndex, 1);
                }
            }
        });

        element.attributes.class = currentClasses.join(' ');

        // Update DOM element if it exists
        if (element._originalElement) {
            element._originalElement.className = element.attributes.class;
        }
    });

    return this;
};