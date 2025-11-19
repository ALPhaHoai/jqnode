// Script to systematically test all test files
const fs = require('fs');
const path = require('path');

/**
 * Dynamically scans the test/node-query directory to build comprehensive test file information.
 * This function provides rich metadata for each test file, enabling flexible usage across
 * different testing environments (Node.js, browser, jQuery comparison).
 *
 * @returns {Array<TestFileInfo>} Array of test file information objects, sorted alphabetically by relativePath
 *
 * @typedef {Object} TestFileInfo
 * @property {string} relativePath - Relative path from test/node-query directory (e.g., 'content-methods/text.test.js')
 * @property {string} windowsPath - Windows-style path with backslashes (e.g., 'content-methods\text.test.js')
 * @property {string} fullPath - Absolute filesystem path to the test file
 * @property {string} category - Main test category (e.g., 'content-methods', 'attributes-methods', 'traversal-methods')
 * @property {string|null} subcategory - Subcategory within the main category (e.g., 'inside', 'outside', 'ancestor') or null
 * @property {string} methodName - The specific method being tested (e.g., 'text', 'attr', 'find')
 * @property {string} filename - The full filename with extension (e.g., 'text.test.js')
 * @property {number} size - File size in bytes
 * @property {Date} modified - Last modification timestamp
 * @property {Date} created - File creation timestamp
 * @property {string} nodeTestPath - Pre-computed path for Node.js test execution (e.g., 'test/node-query/content-methods/text.test.js')
 * @property {string} jqueryTestPath - Pre-computed path for jQuery comparison tests (e.g., 'test/jquery-comparison/content-methods/text.test.js')
 * @property {string} browserTestPath - Pre-computed path for browser tests (e.g., 'browser-test/all-tests/test-files/content-methods/text.test.js')
 *
 * @example
 * ```javascript
 * const { getTestFiles } = require('./test_all_files.js');
 * const testFiles = getTestFiles();
 *
 * console.log(`Found ${testFiles.length} test files`);
 *
 * // Get content-methods tests
 * const contentTests = testFiles.filter(f => f.category === 'content-methods');
 *
 * // Use pre-computed paths
 * for (const testFile of testFiles) {
 *   console.log(`Testing: ${testFile.relativePath}`);
 *   // Run Node.js test: testFile.nodeTestPath
 *   // Run jQuery test: testFile.jqueryTestPath
 *   // Run browser test: testFile.browserTestPath
 * }
 * ```
 */
function getTestFiles() {
    const testDir = 'test/node-query';
    const testFiles = [];

    function scanDir(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scanDir(fullPath);
            } else if (item.endsWith('.test.js')) {
                // Get relative path from test/node-query directory
                const relativePath = path.relative(testDir, fullPath).replace(/\\/g, '/');
                const windowsPath = relativePath.replace(/\//g, '\\');

                // Extract category and method information
                const pathParts = relativePath.split('/');
                const category = pathParts.length > 1 ? pathParts[0] : 'root';
                const subcategory = pathParts.length > 2 ? pathParts[1] : null;
                const filename = pathParts[pathParts.length - 1];
                const methodName = filename.replace('.test.js', '');

                testFiles.push({
                    // Basic path information
                    relativePath,           // 'content-methods/text.test.js'
                    windowsPath,            // 'content-methods\text.test.js'
                    fullPath,              // 'test/node-query/content-methods/text.test.js'

                    // Categorization
                    category,              // 'content-methods'
                    subcategory,           // 'text' or null
                    methodName,            // 'text'
                    filename,              // 'text.test.js'

                    // File metadata
                    size: stat.size,
                    modified: stat.mtime,
                    created: stat.birthtime,

                    // Computed paths for different use cases
                    nodeTestPath: `test/node-query/${relativePath}`,
                    jqueryTestPath: `test/jquery-comparison/${relativePath}`,
                    browserTestPath: `browser-test/all-tests/test-files/${relativePath}`
                });
            }
        }
    }

    if (fs.existsSync(testDir)) {
        scanDir(testDir);
    }

    // Sort for consistent ordering
    return testFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

console.log('Dynamic test file loader initialized');

module.exports = { getTestFiles };
