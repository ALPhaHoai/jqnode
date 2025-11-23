/**
 * Tests for $.title() static method and .title() instance method
 */

import jq from '../../../index';

describe('$.title() and .title()', () => {
    beforeEach(() => {
        // Clear the root nodes registry before each test
        jq.clearRootNodesRegistry();
    });

    afterEach(() => {
        // Clean up after each test
        jq.clearRootNodesRegistry();
    });

    describe('Static method: $.title()', () => {
        it('should be accessible as a static method', () => {
            expect(typeof jq.title).toBe('function');
        });

        it('should return empty string when no HTML is loaded', () => {
            const result = jq.title();
            expect(result).toBe('');
        });

        it('should get the document title from parsed HTML', () => {
            // Parse HTML with a title element
            jq('<html><head><title>Test Page Title</title></head><body></body></html>');

            const result = jq.title();
            expect(result).toBe('Test Page Title');
        });

        it('should return empty string if no title element exists', () => {
            jq('<html><head></head><body></body></html>');

            const result = jq.title();
            expect(result).toBe('');
        });

        it('should handle special characters in title', () => {
            jq(
                '<html><head><title>Test &amp; Title &lt;with&gt; "special" characters</title></head></html>',
            );

            const result = jq.title();
            expect(result).toBe('Test & Title <with> "special" characters');
        });

        it('should trim whitespace from title', () => {
            jq('<html><head><title>  Title with spaces  </title></head></html>');

            const result = jq.title();
            expect(result).toBe('Title with spaces');
        });

        it('should work with nested head structure', () => {
            jq(
                '<html><head><meta charset="utf-8"><title>Nested Title</title></head><body></body></html>',
            );

            const result = jq.title();
            expect(result).toBe('Nested Title');
        });

        it('should return concatenated text if multiple titles exist', () => {
            jq('<html><head><title>First Title</title><title>Second Title</title></head></html>');

            const result = jq.title();
            // jQuery's .text() concatenates text from all matched elements
            expect(result).toBe('First TitleSecond Title');
        });
    });

    describe('Instance method: .title()', () => {
        it('should be accessible as an instance method', () => {
            const $html = jq('<html><head><title>Test</title></head></html>');
            expect(typeof $html.title).toBe('function');
        });

        it('should get the document title using chained syntax', () => {
            const title = jq(
                '<html><head><title>My Website</title></head><body></body></html>',
            ).title();
            expect(title).toBe('My Website');
        });

        it('should return empty string when no title element exists', () => {
            const title = jq('<html><head></head><body></body></html>').title();
            expect(title).toBe('');
        });

        it('should handle special characters in title', () => {
            const title = jq(
                '<html><head><title>Test &amp; Title &lt;with&gt; "special" characters</title></head></html>',
            ).title();
            expect(title).toBe('Test & Title <with> "special" characters');
        });

        it('should trim whitespace from title', () => {
            const title = jq(
                '<html><head><title>  Title with spaces  </title></head></html>',
            ).title();
            expect(title).toBe('Title with spaces');
        });

        it('should work with nested head structure', () => {
            const title = jq(
                '<html><head><meta charset="utf-8"><title>Nested Title</title></head><body></body></html>',
            ).title();
            expect(title).toBe('Nested Title');
        });

        it('should work when called on the parsed HTML element', () => {
            const $html = jq('<html><head><title>Chained Title</title></head><body></body></html>');
            const title = $html.title();
            expect(title).toBe('Chained Title');
        });

        it('should return concatenated text if multiple titles exist', () => {
            const title = jq(
                '<html><head><title>First Title</title><title>Second Title</title></head></html>',
            ).title();
            // jQuery's .text() concatenates text from all matched elements
            expect(title).toBe('First TitleSecond Title');
        });
    });
});
