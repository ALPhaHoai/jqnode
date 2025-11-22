import type { HtmlNode, JQ } from '../../types';

/**
 * Remove a previously-stored piece of data.
 */
function removeData(this: JQ, name?: string | string[]): JQ {
    return this.each(function (this: HtmlNode) {
        if (!this._jqData) return;

        if (name === undefined) {
            this._jqData = {};
            return;
        }

        const keys = Array.isArray(name) ? name : (typeof name === 'string' ? name.split(/\s+/) : []);
        keys.forEach(k => {
            if (this._jqData) {
                delete this._jqData[k];
            }
        });
    });
}

export = removeData;
