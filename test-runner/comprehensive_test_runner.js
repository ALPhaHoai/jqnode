#!/usr/bin/env node

/**
 * Unified Comprehensive Test Runner for node-query
 *
 * REFACTORED INTO MODULAR ARCHITECTURE:
 * - config.js: Configuration management and validation
 * - logger.js: Logging system with levels and formatting
 * - browser-manager.js: Browser automation logic
 * - test-runner.js: Core test execution logic
 * - cli.js: CLI parsing and main entry point
 * - utils.js: Shared utilities and error handling
 *
 * Features:
 * - Browser testing with Playwright or MCP browser extension
 * - Node.js testing with Jest
 * - jQuery comparison testing
 * - Sequential execution with interactive retry mode
 * - CLI skip options (--skip-node, --skip-browser, --skip-jquery)
 * - Interactive retry mode with manual intervention
 * - Automated retry with configurable max iterations
 * - Cross-test result comparison and mismatch detection
 * - Comprehensive error analysis and fixing guidance
 * - Dynamic test file loading with rich metadata
 * - Environment variable and CLI configuration
 * - Single file and batch testing capabilities
 */

// CLI import for main execution
const { CLI } = require('./cli.js');

// Backward compatibility exports
const { getTestFiles } = require('./test_all_files.js');
const { config } = require('./config');
const { TestRunner } = require('./test-runner');
const { runNodeTest: originalRunNodeTest } = require('./test-runner');
const { compareResults } = require('./utils');
const { getTestPaths } = require('./utils');

// Legacy function exports for backward compatibility
function getNodeTestPath(testFileObj) {
    return getTestPaths(testFileObj).nodeTestPath;
}

function getJQueryTestPath(testFileObj) {
    return getTestPaths(testFileObj).jqueryTestPath;
}

// Legacy runNodeTest function (delegates to new implementation)
async function runNodeTest(testPath, options = {}) {
    const testRunner = new TestRunner([]);
    try {
        return await testRunner.runNodeTest(testPath, options);
    } finally {
        await testRunner.cleanup();
    }
}

// Legacy runJQueryComparisonTest function
function runJQueryComparisonTest(testPath) {
    const testRunner = new TestRunner([]);
    try {
        return testRunner.runJQueryComparisonTest(testPath);
    } finally {
        // No cleanup needed for sync function
    }
}

// Legacy UnifiedTestRunner class for backward compatibility
class UnifiedTestRunner {
    constructor() {
        this.testRunner = new TestRunner(getTestFiles());
    }

    async initBrowser() {
        return await this.testRunner.initialize();
    }

    async closeBrowser() {
        return await this.testRunner.cleanup();
    }

    async runBrowserTest(fileName) {
        return await this.testRunner.runBrowserTest(fileName);
    }

    async runNodeTest(testFile) {
        return await this.testRunner.runNodeJSTest(testFile);
    }

    async runJQueryComparisonTest(testFile) {
        return await this.testRunner.runJQueryComparisonTestForFile(testFile);
    }

    async processTestFile(testFile) {
        return await this.testRunner.processTestFile(testFile);
    }

    async runSequential() {
        return await this.testRunner.runSequential();
    }

    async runAllTests() {
        return await this.testRunner.runAllTests();
    }

    async runSingleFile(fileName) {
        return await this.testRunner.runSingleFile(fileName);
    }

    printSummary() {
        return this.testRunner.printSummary();
    }

    analyzeErrors() {
        return this.testRunner.analyzeErrors();
    }
}

// Main comprehensive test runner
async function runAllTests(options = {}) {
    const {
        skipNode = config.get('skipNode'),
        skipBrowser = config.get('skipBrowser'),
        skipJQuery = config.get('skipJQuery'),
    } = options;

    console.log('🚀 Starting comprehensive automated testing for node-query');
    console.log(`📋 Found ${getTestFiles().length} test files to process`);

    if (!skipBrowser && config.get('browserEngine') !== 'mcp') {
        const http = require('http');
        await new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: '127.0.0.1',
                    port: 8080,
                    path: '/browser-test/all-tests/index.html',
                    method: 'HEAD',
                    timeout: 5000,
                },
                () => resolve(),
            );
            req.on('error', () => {
                console.log('❌ Server not running. Please start with: npm run test:browser:serve');
                process.exit(1);
            });
            req.on('timeout', () => {
                req.destroy();
                console.log('❌ Server not running. Please start with: npm run test:browser:serve');
                process.exit(1);
            });
        });
    }

    console.log(`\n🎯 Test configuration:`);
    console.log(`   Node.js tests: ${skipNode ? 'SKIP' : 'RUN'}`);
    console.log(
        `   Browser tests: ${skipBrowser ? 'SKIP' : 'RUN'} (${config.get('browserEngine')})`,
    );
    console.log(`   jQuery comparison: ${skipJQuery ? 'SKIP' : 'RUN'}\n`);

    const results = {
        total: getTestFiles().length,
        processed: 0,
        nodeResults: { passed: 0, failed: 0, errors: [] },
        browserResults: { passed: 0, failed: 0, errors: [] },
        jqueryResults: { passed: 0, failed: 0, errors: [] },
        mismatches: [],
    };

    for (const testFile of getTestFiles()) {
        console.log(`\n🔬 Processing: ${testFile.windowsPath}`);
        results.processed++;

        let nodeResult = { success: true };
        let browserResult = { success: true };
        let jqueryResult = { success: true };

        try {
            // Run Node.js test
            if (!skipNode) {
                const nodeTestPath = getTestPaths(testFile).nodeTestPath;
                console.log(`📝 Running Node.js test: ${nodeTestPath}`);
                nodeResult = await runNodeTest(nodeTestPath);

                if (!nodeResult.success) {
                    console.log(`❌ Node.js test failed:`, nodeResult.stderr);
                    results.nodeResults.failed++;
                    results.nodeResults.errors.push({
                        file: testFile,
                        details: nodeResult.stderr,
                    });
                } else {
                    results.nodeResults.passed++;
                }
            }

            // Run browser test
            if (!skipBrowser) {
                const runner = new TestRunner([]);
                if (config.get('browserEngine') === 'mcp') {
                    await runner.browserManager.initializeMCPBrowser();
                } else {
                    await runner.initialize();
                }
                browserResult = await runner.runBrowserTest(testFile.windowsPath);
                await runner.cleanup();

                if (!browserResult.success) {
                    results.browserResults.failed++;
                    results.browserResults.errors.push({
                        file: testFile,
                        details: browserResult.error || 'Browser test failed',
                    });
                } else {
                    results.browserResults.passed++;
                }
            }

            // Run jQuery comparison test
            if (!skipJQuery) {
                const jqueryTestPath = getTestPaths(testFile).jqueryTestPath;
                console.log(`🔍 Running jQuery comparison: ${jqueryTestPath}`);
                jqueryResult = runJQueryComparisonTest(jqueryTestPath);

                if (!jqueryResult.success) {
                    console.log(`❌ jQuery comparison failed:`, jqueryResult.error);
                    results.jqueryResults.failed++;
                    results.jqueryResults.errors.push({
                        file: testFile,
                        details: jqueryResult.error,
                    });
                } else {
                    results.jqueryResults.passed++;
                }
            }

            // Compare results
            if (!skipNode && !skipBrowser && !skipJQuery) {
                const matches = compareResults(nodeResult, browserResult, jqueryResult, testFile);
                if (!matches) {
                    results.mismatches.push(testFile);
                }
            }
        } catch (error) {
            console.log(`💥 Error processing ${testFile}:`, error.message);
            const errorDetails = {
                file: testFile,
                type: 'processing-error',
                details: error.message,
            };

            results.nodeResults.errors.push(errorDetails);
            results.browserResults.errors.push(errorDetails);
            results.jqueryResults.errors.push(errorDetails);
        }
    }

    // Final summary
    console.log('\n📊 COMPREHENSIVE TEST SUMMARY:');
    console.log(`   Total files processed: ${results.processed}`);

    if (!skipNode) {
        console.log(`\n📝 Node.js Tests:`);
        console.log(`   Passed: ${results.nodeResults.passed}`);
        console.log(`   Failed: ${results.nodeResults.failed}`);
    }

    if (!skipBrowser) {
        console.log(`\n🌐 Browser Tests:`);
        console.log(`   Passed: ${results.browserResults.passed}`);
        console.log(`   Failed: ${results.browserResults.failed}`);
    }

    if (!skipJQuery) {
        console.log(`\n🔍 jQuery Comparisons:`);
        console.log(`   Passed: ${results.jqueryResults.passed}`);
        console.log(`   Failed: ${results.jqueryResults.failed}`);
    }

    if (!skipNode && !skipBrowser && !skipJQuery) {
        console.log(`\n⚖️  Cross-Test Comparison:`);
        console.log(`   Mismatches: ${results.mismatches.length}`);
    }

    // Show detailed errors
    const allErrors = [
        ...results.nodeResults.errors,
        ...results.browserResults.errors,
        ...results.jqueryResults.errors,
    ];

    if (allErrors.length > 0) {
        console.log('\n❌ ERRORS FOUND:');
        const uniqueErrors = allErrors.filter(
            (error, index, self) =>
                index ===
                self.findIndex((e) => e.file === error.file && e.details === error.details),
        );

        uniqueErrors.forEach((error) => {
            console.log(`   - ${error.file}: ${error.details.split('\n')[0]}`);
        });
    }

    if (results.mismatches.length > 0) {
        console.log('\n⚠️  RESULT MISMATCHES:');
        results.mismatches.forEach((file) => {
            console.log(`   - ${file}`);
        });
    }

    const hasErrors = allErrors.length > 0;
    const hasMismatches = results.mismatches.length > 0;

    if (!hasErrors && !hasMismatches) {
        console.log('\n✅ ALL TESTS PASSED! 🎉');
    } else {
        console.log(
            `\n💥 Testing completed with ${allErrors.length} errors and ${results.mismatches.length} mismatches`,
        );
    }

    return results;
}

// Main execution
if (require.main === module) {
    const cli = new CLI();
    cli.run().catch(console.error);
}

// Exported functions
module.exports = {
    runAllTests,
    runBrowserTest: (fileName) => {
        const runner = new TestRunner([]);
        return runner.runBrowserTest(fileName);
    },
    runNodeTest,
    runJQueryComparisonTest,
    getNodeTestPath,
    getJQueryTestPath,
    testFiles: getTestFiles(),
    UnifiedTestRunner,
    CONFIG: config.getAll(),
};
