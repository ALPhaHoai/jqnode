/**
 * CLI module for jqnode test runner
 * Handles command line argument parsing and main entry point
 */

const { config } = require('./config');
const { logger } = require('./logger');
const { TestRunner } = require('./test-runner');
const { getTestFiles } = require('./test_all_files.js');
const { TestRunnerError } = require('./utils');

class CLI {
  constructor() {
    this.args = process.argv.slice(2);
    this.testFiles = getTestFiles();
  }

  parseArgs() {
    const parsedArgs = {
      skipNode: false,
      skipBrowser: false,
      skipJQuery: false,
      singleFile: null,
      showHelp: false
    };

    for (const arg of this.args) {
      switch (arg) {
        case '--skip-node':
          parsedArgs.skipNode = true;
          break;
        case '--skip-browser':
          parsedArgs.skipBrowser = true;
          break;
        case '--skip-jquery':
          parsedArgs.skipJQuery = true;
          break;
        case '--help':
        case '-h':
          parsedArgs.showHelp = true;
          break;
        default:
          // If it's not a flag and not starting with '-', treat as single file
          if (!arg.startsWith('--') && !arg.startsWith('-')) {
            parsedArgs.singleFile = arg;
          }
          break;
      }
    }

    return parsedArgs;
  }

  showHelp() {
    console.log(`
🚀 jqnode Comprehensive Test Runner

USAGE:
  node comprehensive_test_runner.js [options] [file]

OPTIONS:
  --skip-node        Skip Node.js tests
  --skip-browser     Skip browser tests
  --skip-jquery      Skip jQuery comparison tests
  --help, -h         Show this help message

ARGUMENTS:
  file               Run tests for a specific file only

ENVIRONMENT VARIABLES:
  TEST_DELAY              Delay between tests in ms (default: 1000)
  TEST_TIMEOUT           Test timeout in ms (default: 30000)
  INCLUDE_BROWSER_URLS   Include browser URLs in output (default: true)
  FAIL_FAST              Stop on first failure (default: false)
  RETRY_ON_FAILURE       Retry failed tests (default: true)
  MAX_ITERATIONS         Maximum retry iterations (default: 10)
  BROWSER_ENGINE         Browser engine: 'playwright' or 'mcp' (default: playwright)
  INTERACTIVE_MODE       Interactive retry mode (default: false)

EXAMPLES:
  node comprehensive_test_runner.js                           # Run all tests
  node comprehensive_test_runner.js --skip-browser           # Skip browser tests
  node comprehensive_test_runner.js selector-methods.js      # Test single file
  node comprehensive_test_runner.js --skip-node --skip-jquery # Browser only

For more information, see the README.md file.
`);
  }

  async checkServer() {
    const http = require('http');

    return new Promise((resolve) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 8080,
        path: '/browser-test/all-tests/index.html',
        method: 'HEAD',
        timeout: 5000
      }, (res) => {
        resolve(true);
      });

      req.on('error', () => {
        logger.error('❌ Server not running. Please start with: npm run test:browser:serve');
        process.exit(1);
      });

      req.on('timeout', () => {
        req.destroy();
        logger.error('❌ Server not running. Please start with: npm run test:browser:serve');
        process.exit(1);
      });
    });
  }

  async runWithSkips(parsedArgs) {
    // Direct TestRunner execution with skip options
    const testRunner = new TestRunner(this.testFiles);

    try {
      await testRunner.initialize();

      if (parsedArgs && parsedArgs.singleFile) {
        // For single file, just check the success flag directly
        // (processTestFile already accounts for skipped test types)
        const result = await testRunner.runSingleFile(parsedArgs.singleFile);
        await testRunner.cleanup();
        const exitCode = result.success ? 0 : 1;
        process.exit(exitCode);
      } else {
        // For all tests, check the results structure
        const results = await testRunner.runAllTests();
        const exitCode = results.nodeResults.errors.length > 0 ||
          results.browserResults.errors.length > 0 ||
          results.jqueryResults.errors.length > 0 ? 1 : 0;

        await testRunner.cleanup();
        process.exit(exitCode);
      }
    } catch (error) {
      console.error('Error during test execution:', error);
      await testRunner.cleanup();
      process.exit(1);
    }
  }

  async runInteractiveMode(testRunner) {
    logger.info('Running in interactive mode');

    testRunner.iteration = 0;
    testRunner.hasErrors = true;

    while (testRunner.hasErrors) {
      testRunner.iteration++;
      logger.info(`\n🔄 INTERACTIVE ITERATION ${testRunner.iteration}`);
      logger.info('═'.repeat(50));

      testRunner.results = [];
      testRunner.errors = [];
      testRunner.hasErrors = false;

      for (const testFile of testRunner.testFiles) {
        const browserResult = await testRunner.runBrowserTest(testFile.windowsPath);
        testRunner.results.push(browserResult);

        const nodeResult = await testRunner.runNodeJSTest(testFile.relativePath);

        if (browserResult.error || nodeResult.error ||
          browserResult.mismatch || browserResult.consoleErrors?.length > 0) {
          testRunner.hasErrors = true;
        }
      }

      testRunner.analyzeErrors();

      if (testRunner.hasErrors) {
        logger.info(`\n⏳ Iteration ${testRunner.iteration} completed with errors.`);
        logger.info('🔧 Please fix the issues above and the test will repeat automatically.');
        logger.info('Press Ctrl+C to stop the test cycle.\n');

        // Wait for user to fix issues (manual intervention)
        await new Promise(resolve => {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl.question('Press Enter when ready to continue testing...', () => {
            rl.close();
            resolve();
          });
        });
      } else {
        logger.info(`\n🎉 Interactive iteration ${testRunner.iteration} completed successfully!`);
        logger.info('✅ All tests pass and match jQuery behavior!');
        break;
      }
    }

    await testRunner.cleanup();

    // Final summary for interactive mode
    logger.info('\n📊 INTERACTIVE MODE FINAL SUMMARY:');
    logger.info(`Iterations run: ${testRunner.iteration}`);
    logger.info(`Total test files: ${testRunner.testFiles.length}`);
    logger.info(`Files with issues: ${testRunner.errors.length}`);

    if (testRunner.errors.length === 0) {
      logger.info('✅ SUCCESS: All tests pass and match jQuery behavior!');
      process.exit(0);
    } else {
      logger.error('❌ Some tests still have issues');
      process.exit(1);
    }
  }

  async run() {
    try {
      const parsedArgs = this.parseArgs();

      if (parsedArgs.showHelp) {
        this.showHelp();
        return;
      }

      // Update config with CLI arguments
      config.updateFromCli(this.args);

      logger.info('🚀 Unified Comprehensive Test Runner for jqnode');
      logger.info(`⏱️  Delay between tests: ${config.get('delay')}ms`);
      logger.info(`⏰ Timeout per test: ${config.get('timeout')}ms`);
      logger.info(`🌐 Browser URLs: ${config.get('includeBrowserUrls') ? 'enabled' : 'disabled'}`);
      logger.info(`🛑 Fail fast: ${config.get('failFast') ? 'enabled' : 'disabled'}`);
      logger.info(`🔄 Retry on failure: ${config.get('retryOnFailure') ? 'enabled' : 'disabled'}`);
      logger.info(`📈 Max iterations: ${config.get('maxIterations')}`);
      logger.info(`🌐 Browser engine: ${config.get('browserEngine')}`);
      logger.info(`🎯 Interactive mode: ${config.get('interactiveMode') ? 'enabled' : 'disabled'}`);
      logger.info(`⏭️  Skip Node.js: ${config.get('skipNode') ? 'YES' : 'NO'}`);
      logger.info(`⏭️  Skip Browser: ${config.get('skipBrowser') ? 'YES' : 'NO'}`);
      logger.info(`⏭️  Skip jQuery: ${config.get('skipJQuery') ? 'YES' : 'NO'}`);
      logger.info('');

      // Check if we need to run with skips
      if (config.get('skipNode') || config.get('skipBrowser') || config.get('skipJQuery')) {
        await this.runWithSkips(parsedArgs);
        return;
      }

      // Check server for browser tests
      if (!config.get('skipBrowser') && config.get('browserEngine') !== 'mcp') {
        await this.checkServer();
      }

      // Initialize test runner
      const testRunner = new TestRunner(this.testFiles);
      await testRunner.initialize();

      logger.info(`📁 Total test files: ${testRunner.testFiles.length}`);

      // Run tests based on mode
      if (parsedArgs.singleFile) {
        await testRunner.runSingleFile(parsedArgs.singleFile);
      } else if (config.get('interactiveMode')) {
        await this.runInteractiveMode(testRunner);
        return; // Exit handled in interactive mode
      } else {
        await testRunner.runAllTests();
      }

      await testRunner.cleanup();
      const success = testRunner.printSummary();
      process.exit(success ? 0 : 1);

    } catch (error) {
      logger.error('Fatal error:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Export for testing
module.exports = {
  CLI
};

// Run CLI if called directly
if (require.main === module) {
  const cli = new CLI();
  cli.run().catch(console.error);
}
