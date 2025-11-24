import type { JqElement, JQ, AttributeValue, GetterSetterReturn } from '../../types';

/**
 * Gets or sets a property on the first element in the collection.
 * @see https://api.jquery.com/prop/
 */
function prop(
    this: JQ,
    name: string | Record<string, AttributeValue>,
    value?: AttributeValue | ((index: number, oldVal: any) => AttributeValue),
): GetterSetterReturn<AttributeValue> {
    // Handle object map: prop({ key: value, ... })
    if (typeof name === 'object' && name !== null) {
        for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
                this.prop(key, name[key]);
            }
        }
        return this;
    }

    // Getter: prop(name)
    if (value === undefined) {
        const element = this.nodes[0];
        if (!element) return undefined;

        if (!element.properties) {
            element.properties = {};
        }

        let result = element.properties[name];

        // Fallback to element property (e.g. node.value, node.checked set by domElementToNode)
        if (result === undefined && (element as any)[name] !== undefined) {
            result = (element as any)[name];
        }

        // Fallback to attribute for initial value if property not set
        if (result === undefined && element.attributes && element.attributes[name] !== undefined) {
            const attrValue = element.attributes[name];
            // Handle boolean attributes
            const booleanAttributes = [
                'checked',
                'selected',
                'disabled',
                'readonly',
                'required',
                'multiple',
                'autofocus',
                'autoplay',
                'hidden',
                'controls',
                'loop',
                'muted',
                'default',
                'open',
                'reversed',
                'scoped',
                'async',
                'defer',
            ];
            if (booleanAttributes.includes(name)) {
                result = attrValue !== undefined; // If attribute exists, property is true
            } else {
                result = attrValue;
            }
        }

        if (name === 'value' && result !== undefined) {
            return String(result);
        }
        return result as string | number | boolean | null | undefined;
    }

    // Setter: prop(name, value) or prop(name, function)
    this.nodes.forEach((element: JqElement, index: number) => {
        if (!element) return;

        if (!element.properties) {
            element.properties = {};
        }

        let valToSet: AttributeValue | undefined;

        if (typeof value === 'function') {
            // Get current value for callback
            let currentProp = element.properties[name];

            if (currentProp === undefined && (element as any)[name] !== undefined) {
                currentProp = (element as any)[name];
            }

            if (
                currentProp === undefined &&
                element.attributes &&
                element.attributes[name] !== undefined
            ) {
                const attrValue = element.attributes[name];
                const booleanAttributes = [
                    'checked',
                    'selected',
                    'disabled',
                    'readonly',
                    'required',
                    'multiple',
                    'autofocus',
                    'autoplay',
                    'hidden',
                    'controls',
                    'loop',
                    'muted',
                    'default',
                    'open',
                    'reversed',
                    'scoped',
                    'async',
                    'defer',
                ];
                if (booleanAttributes.includes(name)) {
                    currentProp = attrValue !== undefined;
                } else {
                    currentProp = attrValue;
                }
            }

            const result = value.call(element, index, currentProp);
            valToSet = result as AttributeValue;
        } else {
            valToSet = value;
        }

        element.properties[name] = valToSet;

        // Sync to DOM element if it exists and has this property
        if (element._originalElement) {
            const domElement = element._originalElement as unknown as Record<string, unknown>;
            // For boolean properties like checked/selected/disabled, we should always sync
            const booleanProps = [
                'checked',
                'selected',
                'disabled',
                'readonly',
                'required',
                'multiple',
                'autofocus',
                'autoplay',
                'hidden',
                'controls',
                'loop',
                'muted',
                'default',
                'open',
                'reversed',
                'scoped',
                'async',
                'defer',
            ];

            if (booleanProps.includes(name) || domElement[name] !== undefined) {
                domElement[name] = valToSet;
            }
        }
    });

    return this;
}

export = prop;
