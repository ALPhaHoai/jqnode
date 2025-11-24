import type { HtmlNode, JQ } from '../../../types';

/**
 * Wrap an HTML structure around each element in the set of matched elements.
 * @param wrappingElement - HTML string or element to wrap around each element
 * @returns The JQ instance for chaining
 * @see https://api.jquery.com/wrap/
 */
function wrap(this: JQ, wrappingElement: string | HtmlNode | JQ): JQ {
    // Normalize the wrapping element structure once if it's a string or simple node
    // But we need a fresh clone for each element we wrap

    for (const element of this.nodes) {
        if (element.parent && element.parent.children) {
            const siblings = element.parent.children;
            const elementIndex = siblings.indexOf(element);

            if (elementIndex !== -1) {
                // 1. Create a deep clone of the wrapping structure
                let wrapperStructure: HtmlNode[];

                if (typeof wrappingElement === 'string') {
                    wrapperStructure = this._normalizeContent(wrappingElement).map((n) =>
                        this._cloneNode(n),
                    );
                } else if (
                    (wrappingElement as any).nodes &&
                    Array.isArray((wrappingElement as any).nodes)
                ) {
                    wrapperStructure = (wrappingElement as JQ).nodes.map((n) => this._cloneNode(n));
                } else {
                    wrapperStructure = this._normalizeContent(wrappingElement as HtmlNode).map(
                        (n) => this._cloneNode(n),
                    );
                }

                if (wrapperStructure.length > 0) {
                    const wrapper = wrapperStructure[0]; // Use the first element as wrapper

                    // 2. Find the innermost element in the wrapper to place our element
                    let targetContainer = wrapper;
                    while (targetContainer.children && targetContainer.children.length > 0) {
                        let foundElement = false;
                        for (const child of targetContainer.children) {
                            if (child.internalType === 'element') {
                                targetContainer = child;
                                foundElement = true;
                                break; // Go down the first element branch
                            }
                        }
                        if (!foundElement) break;
                    }

                    // 3. Replace the original element with the wrapper in the parent
                    siblings[elementIndex] = wrapper;
                    wrapper.parent = element.parent;

                    // 4. Move the original element into the target container
                    if (!targetContainer.children) {
                        targetContainer.children = [];
                    }
                    targetContainer.children.push(element);
                    element.parent = targetContainer;
                }
            }
        }
    }

    return this;
}

export = wrap;
