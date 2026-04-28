import type { JQ } from '../../types';
import { initDataAttributes, toCamelCase, NodeWithData } from '../../helpers/dataHelper';

/**
 * Remove a previously-stored piece of data.
 * @see https://api.jquery.com/removeData/
 */
function removeData(this: JQ, name?: string | string[]): JQ {
    return this.each(function (this: NodeWithData) {
        // Ensure attributes are parsed so we can "remove" them (by deleting from the cache)
        // If we don't parse, a subsequent .data() call would re-read the attribute.
        initDataAttributes(this);

        if (!this._jqData) return;

        if (name === undefined) {
            this._jqData = {};
            return;
        }

        const keys = Array.isArray(name) ? name : typeof name === 'string' ? name.split(/\s+/) : [];

        keys.forEach((k) => {
            const camelKey = toCamelCase(k);

            if (this._jqData) {
                delete this._jqData[camelKey];
            }
        });
    });
}

export default removeData;
