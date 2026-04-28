import type { JqElement } from '../types';

/**
 * Class Attribute Utilities
 * 
 * Helper functions for manipulating CSS class attributes on elements.
 * These utilities centralize the common patterns of parsing, modifying,
 * and setting class attributes.
 */

/**
 * Parses a class attribute string into an array of class names
 * @param classStr - The class attribute string (can be null or undefined)
 * @returns Array of class names (empty array if no classes)
 */
export function parseClassString(classStr: string | null | undefined): string[] {
    if (!classStr) return [];
    return classStr.trim().split(/\s+/).filter((cls) => cls.length > 0);
}

/**
 * Serializes an array of class names into a class attribute string
 * @param classes - Array of class names
 * @returns Space-separated class string
 */
export function serializeClassList(classes: string[]): string {
    return classes.join(' ');
}

/**
 * Gets the class attribute from an element with empty string fallback
 * @param element - The element to get the class from
 * @returns The class attribute value or empty string
 */
export function getClassAttribute(element: JqElement): string {
    return element.getAttribute('class') || '';
}

/**
 * Sets the class attribute on an element and syncs to original DOM element if present
 * @param element - The element to set the class on
 * @param classes - Array of class names
 * @param syncToDOM - Whether to sync to _originalElement (default: true)
 */
export function setClassAttribute(
    element: JqElement,
    classes: string[],
    syncToDOM: boolean = true,
): void {
    const newClass = serializeClassList(classes);
    element.setAttribute('class', newClass);

    if (syncToDOM && element._originalElement) {
        element._originalElement.className = newClass;
    }
}

/**
 * Adds classes to an element (ignores duplicates)
 * @param element - The element to add classes to
 * @param classNames - Array of class names to add
 * @param syncToDOM - Whether to sync to _originalElement (default: true)
 */
export function addClassesToElement(
    element: JqElement,
    classNames: string[],
    syncToDOM: boolean = true,
): void {
    const currentClasses = parseClassString(getClassAttribute(element));

    classNames.forEach((cls) => {
        if (!currentClasses.includes(cls)) {
            currentClasses.push(cls);
        }
    });

    setClassAttribute(element, currentClasses, syncToDOM);
}

/**
 * Removes classes from an element
 * @param element - The element to remove classes from
 * @param classNames - Array of class names to remove
 * @param syncToDOM - Whether to sync to _originalElement (default: true)
 */
export function removeClassesFromElement(
    element: JqElement,
    classNames: string[],
    syncToDOM: boolean = true,
): void {
    let currentClasses = parseClassString(getClassAttribute(element));

    classNames.forEach((cls) => {
        const index = currentClasses.indexOf(cls);
        if (index !== -1) {
            currentClasses.splice(index, 1);
        }
    });

    setClassAttribute(element, currentClasses, syncToDOM);
}
