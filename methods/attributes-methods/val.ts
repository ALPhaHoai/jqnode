import { JqElement } from '../../types';
import type { JQ, FormValueInput, GetterSetterReturn } from '../../types';

// ============================================================================
// Helper Functions: Element Type Checks
// ============================================================================

function isInputElement(element: JqElement): boolean {
    return element.tagName?.toLowerCase() === 'input';
}

function isSelectElement(element: JqElement): boolean {
    return element.tagName?.toLowerCase() === 'select';
}

function isTextareaElement(element: JqElement): boolean {
    return element.tagName?.toLowerCase() === 'textarea';
}

function isOptionElement(element: JqElement): boolean {
    return element.internalType === 'element' && element.tagName?.toLowerCase() === 'option';
}

// ============================================================================
// Helper Functions: Text Content Extraction
// ============================================================================

function getTextContentFromChildren(element: JqElement): string {
    if (!element.children || element.children.length === 0) {
        return '';
    }
    return element.children
        .filter((child: JqElement) => child.internalType === 'text')
        .map((child: JqElement) => child.textData || '')
        .join('');
}

// ============================================================================
// Helper Functions: Option Value Extraction
// ============================================================================

function getOptionValue(option: JqElement): string {
    const value = option.getAttribute('value');
    if (value !== null) {
        return value;
    }
    return option.children?.[0]?.data || '';
}

// ============================================================================
// Helper Functions: Selection State
// ============================================================================

function isOptionSelected(option: JqElement): boolean {
    const hasProp = option.properties?.selected !== undefined;
    const isPropSelected = hasProp && option.properties?.selected === true;
    const isAttrSelected = option.getAttribute('selected') !== null;
    return hasProp ? isPropSelected : isAttrSelected;
}

function isPropSelected(option: JqElement): boolean {
    return option.properties?.selected === true;
}

// ============================================================================
// Helper Functions: Get Value Operations
// ============================================================================

function getInputValue(element: JqElement): string {
    if (element.properties?.value !== undefined) {
        return String(element.properties.value);
    }
    const attrValue = element.getAttribute('value');
    if (attrValue !== null) {
        return attrValue;
    }
    return getTextContentFromChildren(element);
}

function getTextareaValue(element: JqElement): string {
    if (element.properties?.value !== undefined) {
        return String(element.properties.value);
    }
    return getTextContentFromChildren(element);
}

interface SelectInfo {
    selectedValues: string[];
    prioritySelectedValue: string | null;
    firstOptionValue: string | null;
}

function collectSelectInfo(element: JqElement): SelectInfo {
    const selectedValues: string[] = [];
    let prioritySelectedValue: string | null = null;
    let foundPropSelected = false;
    let firstOptionValue: string | null = null;

    if (!element.children) {
        return { selectedValues, prioritySelectedValue, firstOptionValue };
    }

    for (const child of element.children) {
        if (!isOptionElement(child)) continue;

        const optionValue = getOptionValue(child);

        if (firstOptionValue === null) {
            firstOptionValue = optionValue;
        }

        if (isOptionSelected(child)) {
            selectedValues.push(optionValue);

            if (isPropSelected(child)) {
                prioritySelectedValue = optionValue;
                foundPropSelected = true;
            } else if (!foundPropSelected) {
                prioritySelectedValue = optionValue;
            }
        }
    }

    return { selectedValues, prioritySelectedValue, firstOptionValue };
}

function getSelectValue(element: JqElement): string | string[] {
    const info = collectSelectInfo(element);
    const isMultiple = element.getAttribute('multiple') !== null;

    if (isMultiple) {
        return info.selectedValues;
    }

    // For single select, return properties.value if set, else priority value, else first option
    if (element.properties?.value !== undefined) {
        return String(element.properties.value);
    }
    if (info.prioritySelectedValue !== null) {
        return info.prioritySelectedValue;
    }
    return info.firstOptionValue ?? '';
}

function getElementValue(element: JqElement): string | string[] | undefined {
    if (!element) return undefined;

    if (isInputElement(element)) {
        return getInputValue(element);
    }
    if (isSelectElement(element)) {
        return getSelectValue(element);
    }
    if (isTextareaElement(element)) {
        return getTextareaValue(element);
    }
    return '';
}

// ============================================================================
// Helper Functions: Set Value Operations
// ============================================================================

function ensureProperties(element: JqElement): void {
    if (!element.properties) {
        element.properties = {};
    }
}

function setInputValue(element: JqElement, value: string): void {
    ensureProperties(element);
    element.properties!.value = value;

    if (element._originalElement) {
        (element._originalElement as unknown as HTMLInputElement).value = value;
    }
}

function setTextareaValue(element: JqElement, value: string): void {
    ensureProperties(element);
    element.properties!.value = value;
    const textNode = new JqElement('text');
    textNode.textData = value;
    element.children = [textNode];

    if (element._originalElement) {
        (element._originalElement as unknown as HTMLTextAreaElement).value = value;
    }
}

function setOptionSelected(option: JqElement, selected: boolean): void {
    ensureProperties(option);
    option.properties!.selected = selected;

    if (option._originalElement) {
        (option._originalElement as unknown as HTMLOptionElement).selected = selected;
    }
}

function setSelectMultipleValue(element: JqElement, values: string[]): void {
    if (!element.children) return;

    element.children.forEach((child: JqElement) => {
        if (isOptionElement(child)) {
            const optionValue = getOptionValue(child);
            const shouldBeSelected = values.includes(optionValue);
            setOptionSelected(child, shouldBeSelected);
        }
    });
}

function setSelectSingleValue(element: JqElement, value: string): void {
    ensureProperties(element);
    element.properties!.value = value;

    if (element._originalElement) {
        (element._originalElement as unknown as HTMLSelectElement).value = value;
    }

    if (!element.children) return;

    element.children.forEach((child: JqElement) => {
        if (isOptionElement(child)) {
            const optionValue = getOptionValue(child);
            const shouldBeSelected = optionValue === value;
            setOptionSelected(child, shouldBeSelected);
        }
    });
}

function setSelectValue(element: JqElement, value: FormValueInput): void {
    const isMultiple = element.getAttribute('multiple') !== null;

    if (isMultiple && Array.isArray(value)) {
        setSelectMultipleValue(element, value);
    } else {
        const stringValue = value === null || value === undefined ? '' : String(value);
        setSelectSingleValue(element, stringValue);
    }
}

function setElementValue(element: JqElement, value: FormValueInput): void {
    const stringValue = value === null || value === undefined ? '' : String(value);

    if (isInputElement(element)) {
        setInputValue(element, stringValue);
    } else if (isSelectElement(element)) {
        setSelectValue(element, value);
    } else if (isTextareaElement(element)) {
        setTextareaValue(element, stringValue);
    }
}

// ============================================================================
// Helper Functions: Function Value Handling
// ============================================================================

function getCurrentValueForCallback(element: JqElement): string | string[] {
    if (isInputElement(element) || isSelectElement(element)) {
        if (element.properties?.value !== undefined) {
            return String(element.properties.value);
        }
        const attrValue = element.getAttribute('value');
        if (attrValue !== null) {
            return attrValue;
        }
        return '';
    }

    if (isTextareaElement(element)) {
        if (element.properties?.value !== undefined) {
            return String(element.properties.value);
        }
        return getTextContentFromChildren(element);
    }

    return '';
}

function setValueFromCallback(
    element: JqElement,
    callback: (index: number, value: string | string[]) => any,
    index: number,
): void {
    const currentValue = getCurrentValueForCallback(element);
    const result = callback.call(element, index, currentValue);
    const stringResult = result === null || result === undefined ? '' : String(result);

    if (isInputElement(element) || isSelectElement(element)) {
        ensureProperties(element);
        element.properties!.value = stringResult;
    } else if (isTextareaElement(element)) {
        ensureProperties(element);
        element.properties!.value = stringResult;
        const textNode = new JqElement('text');
        textNode.textData = stringResult;
        element.children = [textNode];
    }
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Gets the current value of the first element or sets the value of every matched element.
 * @see https://api.jquery.com/val/
 * @param {string} [value] - Value to set (if setting)
 * @returns {string|JQ} Current value if getting, JQ instance if setting
 */
// Getter overload
function val(this: JQ): GetterSetterReturn<string | string[]>;
// Setter overload
function val(this: JQ, value: FormValueInput): JQ;
// Implementation
function val(this: JQ, value?: FormValueInput): GetterSetterReturn<string | string[]> {
    // Getter: Get value from first element
    if (value === undefined) {
        return getElementValue(this.nodes[0]);
    }

    // Function setter: Call function for each element
    if (typeof value === 'function') {
        this.nodes.forEach((element: JqElement, index: number) => {
            if (element) {
                setValueFromCallback(element, value, index);
            }
        });
        return this;
    }

    // Direct setter: Set value on all elements
    this.nodes.forEach((element: JqElement) => {
        if (element) {
            setElementValue(element, value);
        }
    });

    return this;
}

export default val;
