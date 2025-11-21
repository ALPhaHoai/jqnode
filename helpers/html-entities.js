/**
 * HTML entity decoding utilities.
 */

/**
 * Decodes HTML entities in a string to match jQuery/Cheerio behavior.
 * @param {string} text - Text containing HTML entities
 * @returns {string} Decoded text
 */
function decodeHTMLEntities(text) {
    const entities = {
        'amp': '&',
        'lt': '<',
        'gt': '>',
        'quot': '"',
        'apos': "'",
        'nbsp': '\u00A0',
        'copy': '©',
        'reg': '®',
        'trade': '™',
        'euro': '€',
        'pound': '£',
        'yen': '¥',
        'cent': '¢',
        'mdash': '—',
        'ndash': '–',
        'hellip': '…',
        'laquo': '«',
        'raquo': '»',
        'lsquo': '\u2018',
        'rsquo': '\u2019',
        'ldquo': '\u201C',
        'rdquo': '\u201D'
    };

    return text.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g,
        (match, dec, hex, named) => {
            if (dec) {
                const code = parseInt(dec, 10);
                return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
            }
            if (hex) {
                const code = parseInt(hex, 16);
                return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
            }
            return entities[named] || match;
        }
    );
}

module.exports = { decodeHTMLEntities };
