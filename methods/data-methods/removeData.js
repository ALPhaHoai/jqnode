/**
 * Remove a previously-stored piece of data.
 * @see https://api.jquery.com/removeData/
 * @param {string|Array} [name] - A string naming the piece of data to delete or space-separated string or array of strings.
 * @returns {JQ} The JQ instance.
 */
module.exports = function removeData(name) {
    return this.each(function () {
        if (!this._jqData) return;

        if (name === undefined) {
            this._jqData = {};
            return;
        }

        const keys = Array.isArray(name) ? name : (typeof name === 'string' ? name.split(/\s+/) : []);
        keys.forEach(k => {
            delete this._jqData[k];
        });
    });
};
