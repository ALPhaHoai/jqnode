/**
 * Test Runner module for jqnode test runner
 * Handles core test execution logic and result management
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const { config } = require('./config');
const { logger } = require('./logger');
const { BrowserManager } = require('./browser-manager');
const {
  TestRunnerError,
  ProcessError,
  parseTestResults,
  compareResults,
  getTestPaths,
  sleep,
  CleanupRegistry
} = require('./utils');

class TestRunner {
  constructor(testFiles) {
    this.testFiles = testFiles || [];
    this.browserManager = new BrowserManager();
    this.cleanupRegistry = new CleanupRegistry();

    // Statistics tracking
    this.stats = {
      totalFiles: this.testFiles.length,
      processedFiles: 0,
      nodePassed: 0,
      nodeTotal: 0,
      jqPassed: 0,
      jqTotal: 0,
      browserPassed: 0,
      browserTotal: 0,
      failedTests: [],
      mismatchedCounts: [],
      startTime: Date.now()
    };

    // Results tracking
    this.results = [];
    this.errors = [];
    this.hasErrors = false;
    this.iteration = 0;
  }

  async initialize() {
    await this.browserManager.initialize();

    // Register cleanup
    this.cleanupRegistry.register(async () => {
      await this.browserManager.close();
    });
  }

  async cleanup() {
    await this.cleanupRegistry.cleanup();
  }

  // Node.js test execution
  async runNodeTest(testPath, options = {}) {
    const { timeout = config.get('timeout') } = options;

    return new Promise((resolve, reject) => {
      logger.debug(`Running Node.js test: ${testPath}`);

      const testProcess = spawn('npx', ['jest', testPath, '--verbose'], {
        stdio: 'pipe',
        shell: true,
        timeout
      });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      testProcess.on('close', (code) => {
        const result = {
          exitCode: code,
          stdout,
          stderr,
          success: code === 0
        };
        resolve(result);
      });

      testProcess.on('error', (error) => {
        reject(new ProcessError(`Node.js test process error: ${error.message}`, -1));
      });

      testProcess.on('timeout', () => {
        testProcess.kill();
        reject(new ProcessError(`Node.js test timed out after ${timeout}ms`, -1));
      });
    });
  }

  // jQuery comparison test execution
  async runJQueryComparisonTest(testPath, options = {}) {
    const { timeout = config.get('timeout') } = options;

    try {
      const result = require('child_process').execSync(`npm test -- ${testPath}`, {
        encoding: 'utf8',
        timeout
      });

      return {
        success: true,
        output: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.stdout || error.message
      };
    }
  }

  // Browser test execution (delegated to browser manager)
  async runBrowserTest(fileName) {
    return await this.browserManager.runBrowserTest(fileName);
  }

  // Unified Node.js test method (consolidated)
  async runNodeJSTest(fileName) {
    const nodeTestPath = path.join('test', 'jqnode', fileName);
    logger.debug(`Running Node.js test for: ${fileName}`);

    try {
      const result = await this.runNodeTest(nodeTestPath);
      const parsed = parseTestResults(result.stdout);

      this.stats.nodePassed += parsed.passed;
      this.stats.nodeTotal += parsed.total;

      if (!result.success) {
        logger.error(`Node.js test failed: ${fileName}`);
        if (result.stderr) logger.error(`Error output: ${result.stderr}`);
        this.stats.failedTests.push(`node-${fileName}`);
        this.errors.push({
          type: 'nodejs_test_failure',
          file: fileName,
          error: result.stderr
        });
      } else {
        logger.info(`Node.js test passed: ${fileName} (${parsed.passed}/${parsed.total})`);
      }

      return {
        file: fileName,
        success: result.success,
        output: result.stdout,
        error: result.stderr,
        results: parsed
      };
    } catch (error) {
      logger.error(`Node.js test error for ${fileName}: ${error.message}`);
      this.errors.push({
        type: 'nodejs_test_failure',
        file: fileName,
        error: error.message
      });
      return {
        file: fileName,
        success: false,
        output: '',
        error: error.message
      };
    }
  }

  // jQuery comparison test method (consolidated)
  async runJQueryComparisonTestForFile(testFile) {
    const jqTestPath = `test/jquery-comparison/${testFile}`;

    if (!fs.existsSync(jqTestPath)) {
      logger.debug(`No jQuery comparison test available for: ${testFile}`);
      return { success: true, results: { passed: 0, total: 0 }, skipped: true };
    }

    logger.debug(`Running jQuery comparison test: ${testFile}`);

    const result = await this.runJQueryComparisonTest(jqTestPath);
    const parsed = parseTestResults(result.output);

    this.stats.jqPassed += parsed.passed;
    this.stats.jqTotal += parsed.total;

    if (!result.success) {
      logger.error(`jQuery comparison test failed: ${testFile}`);
      if (result.error) logger.error(`Error output: ${result.error}`);
      this.stats.failedTests.push(`jquery-${testFile}`);
      this.errors.push({
        type: 'jquery_test_failure',
        file: testFile,
        error: result.error
      });
    } else {
      logger.info(`jQuery comparison test passed: ${testFile} (${parsed.passed}/${parsed.total})`);
    }

    return {
      success: result.success,
      results: parsed,
      skipped: false,
      output: result.output,
      error: result.error
    };
  }

  // Process single test file
  async processTestFile(testFile) {
    try {
      const fileName = testFile.relativePath || testFile;
      logger.info(`Testing: ${fileName}`);
      logger.info('='.repeat(60));

      if (config.get('includeBrowserUrls')) {
        logger.info(`Browser URL: http://127.0.0.1:8080/browser-test/all-tests/index.html?library=jqnode&file=${encodeURIComponent(fileName)}`);
      }

      // Run all test types (respecting CLI skip options)
      let browserResult = { success: true };
      let nodeResult = { success: true };
      let jqResult = { success: true };

      if (!config.get('skipBrowser')) {
        browserResult = await this.runBrowserTest(testFile.windowsPath || fileName);
      }

      if (!config.get('skipNode')) {
        nodeResult = await this.runNodeJSTest(fileName);
      }

      if (!config.get('skipJQuery')) {
        jqResult = await this.runJQueryComparisonTestForFile(fileName);
      }

      // Check for test count mismatches
      if (!jqResult.skipped && browserResult.nodeQuery && browserResult.jQuery &&
        browserResult.nodeQuery.total !== browserResult.jQuery.total) {
        logger.warn(`Test count mismatch: Node.js (${browserResult.nodeQuery.total}) vs jQuery (${browserResult.jQuery.total})`);
        this.stats.mismatchedCounts.push(fileName);
      } else if (!jqResult.skipped) {
        logger.info(`Test counts match`);
      }

      // Analyze issues (respecting skip options)
      const issues = [];
      if (!config.get('skipBrowser')) {
        if (browserResult.error) {
          issues.push({ type: 'browser_error', file: fileName, error: browserResult.error });
        }
        if (browserResult.mismatch) {
          issues.push({ type: 'mismatch', file: fileName, nodeQuery: browserResult.nodeQuery, jQuery: browserResult.jQuery });
        }
        if (browserResult.consoleErrors && browserResult.consoleErrors.length > 0) {
          issues.push({ type: 'console_error', file: fileName, errors: browserResult.consoleErrors });
        }
      }

      if (!config.get('skipNode') && !nodeResult.success) {
        issues.push({ type: 'nodejs_test_failure', file: fileName, error: nodeResult.error });
      }

      if (!config.get('skipJQuery') && !jqResult.success && !jqResult.skipped) {
        issues.push({ type: 'jquery_test_failure', file: fileName, error: jqResult.error });
      }

      const browserSuccess = config.get('skipBrowser') || (browserResult.error ? false : !browserResult.mismatch);
      const nodeSuccess = config.get('skipNode') || nodeResult.success;
      const jqSuccess = config.get('skipJQuery') || jqResult.success || jqResult.skipped;
      const overallSuccess = browserSuccess && nodeSuccess && jqSuccess;

      if (overallSuccess) {
        logger.info(`All tests passed for: ${fileName}`);
      } else {
        logger.warn(`Issues found in: ${fileName}`);
        this.errors.push(...issues);
        if (config.get('failFast')) {
          throw new TestRunnerError(`Test failure in ${fileName}`);
        }
      }

      this.stats.processedFiles++;

      return {
        file: fileName,
        issues,
        success: overallSuccess,
        results: { browserResult, nodeResult, jqResult }
      };

    } catch (error) {
      logger.error(`Error processing ${testFile.relativePath || testFile}:`, error.message);
      this.stats.failedTests.push(testFile.relativePath || testFile);
      this.stats.processedFiles++;

      if (config.get('failFast')) {
        throw error;
      }

      return {
        file: testFile.relativePath || testFile,
        error: error.message,
        success: false
      };
    }
  }

  // Sequential execution
  async runSequential() {
    logger.info('Running tests sequentially...\n');

    for (const testFile of this.testFiles) {
      const result = await this.processTestFile(testFile);

      if (!result.success && config.get('failFast')) {
        break;
      }

      if (this.stats.processedFiles < this.stats.totalFiles) {
        await sleep(config.get('delay'));
      }
    }
  }

  // Error analysis
  analyzeErrors() {
    logger.info('\n🔍 ERROR ANALYSIS:');

    if (this.errors.length === 0) {
      logger.info('✅ No errors found!');
      this.hasErrors = false;
      return;
    }

    const errorGroups = {};
    this.errors.forEach(error => {
      if (!errorGroups[error.type]) {
        errorGroups[error.type] = [];
      }
      errorGroups[error.type].push(error);
    });

    Object.keys(errorGroups).forEach(type => {
      const errors = errorGroups[type];
      logger.info(`\n${type.toUpperCase()} (${errors.length} instances):`);

      errors.forEach(error => {
        switch (type) {
          case 'mismatch':
            logger.info(`📊 ${error.file}: jqnode ${error.nodeQuery.passed}/${error.nodeQuery.total} vs jQuery ${error.jQuery.passed}/${error.jQuery.total}`);
            break;
          case 'console_error':
            logger.error(`🔴 ${error.file}: ${error.errors.join(', ')}`);
            break;
          case 'test_error':
            logger.error(`💥 ${error.file}: ${error.error}`);
            break;
          case 'nodejs_test_failure':
            logger.error(`🟢 ${error.file}: Node.js test failed`);
            break;
          case 'jquery_test_failure':
            logger.error(`🟡 ${error.file}: jQuery test failed`);
            break;
          case 'browser_error':
            logger.error(`🌐 ${error.file}: Browser test failed - ${error.error}`);
            break;
        }
      });
    });

    logger.info('\n🛠️  FIXING GUIDANCE:');
    logger.info('1. Check method implementations in methods/ directory');
    logger.info('2. Compare with jQuery behavior using test-jquery-behavior.js');
    logger.info('3. Run specific debug scripts for failed methods');
    logger.info('4. Update test expectations if jQuery behavior is correct');
    logger.info('5. Do not edit generated files in browser-test/');
  }

  // Main execution loop with retry logic
  async runAllTests() {
    logger.info('🚀 Starting unified comprehensive test run...');
    logger.info('📋 Testing browser, Node.js, and jQuery compatibility');
    logger.info('🔄 Will retry until all tests pass (or max iterations reached)');
    logger.info('🎯 Using jQuery as single source of truth');
    logger.info('');

    this.iteration = 0;
    this.hasErrors = true;

    const finalResults = {
      nodeResults: { errors: [] },
      browserResults: { errors: [] },
      jqueryResults: { errors: [] }
    };

    while (this.hasErrors && this.iteration < config.get('maxIterations')) {
      this.iteration++;
      logger.info(`\n🔄 ITERATION ${this.iteration}/${config.get('maxIterations')}`);
      logger.info('='.repeat(60));

      this.results = [];
      this.errors = [];
      this.hasErrors = false;

      // Reset stats for this iteration
      this.stats.processedFiles = 0;
      this.stats.failedTests = [];
      this.stats.mismatchedCounts = [];

      await this.runSequential();
      this.analyzeErrors();

      if (this.hasErrors) {
        logger.info(`\n⏳ Iteration ${this.iteration} completed with errors.`);

        if (this.iteration < config.get('maxIterations')) {
          logger.info('🔧 Fix the issues above and the test will retry automatically.');
          logger.info('Press Ctrl+C to stop the test cycle.\n');

          // Manual intervention prompt
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
          logger.error(`\n❌ Maximum iterations (${config.get('maxIterations')}) reached. Stopping.`);
          break;
        }
      } else {
        logger.info(`\n🎉 Iteration ${this.iteration} completed successfully!`);
        logger.info('✅ All tests pass and match jQuery behavior!');
        break;
      }
    }

    // Populate final results with any remaining errors
    if (this.stats.failedTests.length > 0) {
      finalResults.nodeResults.errors = this.stats.failedTests.map(test => ({ test, type: 'node' }));
      finalResults.browserResults.errors = this.stats.failedTests.map(test => ({ test, type: 'browser' }));
      finalResults.jqueryResults.errors = this.stats.failedTests.map(test => ({ test, type: 'jquery' }));
    }

    return finalResults;
  }

  // Single file testing capability
  async runSingleFile(fileName) {
    logger.info(`🎯 Running single test suite: ${fileName}`);

    const result = await this.processTestFile({ relativePath: fileName, windowsPath: fileName });
    return result;
  }

  // Final summary
  printSummary() {
    const duration = Date.now() - this.stats.startTime;

    logger.info('\n' + '='.repeat(60));
    logger.info('📊 FINAL SUMMARY');
    logger.info('='.repeat(60));
    logger.info(`Total test files: ${this.stats.totalFiles}`);
    logger.info(`Files processed: ${this.stats.processedFiles}`);
    logger.info(`Iterations run: ${this.iteration}`);
    logger.info(`Browser tests passed: ${this.stats.browserPassed}/${this.stats.browserTotal}`);
    logger.info(`Node.js tests passed: ${this.stats.nodePassed}/${this.stats.nodeTotal}`);
    logger.info(`jQuery tests passed: ${this.stats.jqPassed}/${this.stats.jqTotal}`);
    logger.info(`Failed test files: ${this.stats.failedTests.length}`);
    logger.info(`Test count mismatches: ${this.stats.mismatchedCounts.length}`);
    logger.info(`Execution time: ${Math.round(duration / 1000)}s`);
    logger.info('');

    if (this.stats.failedTests.length > 0) {
      logger.error('❌ Failed tests:');
      this.stats.failedTests.forEach(test => logger.error(`  - ${test}`));
      logger.info('');
    }

    if (this.stats.mismatchedCounts.length > 0) {
      logger.warn('⚠️  Test count mismatches:');
      this.stats.mismatchedCounts.forEach(test => logger.warn(`  - ${test}`));
      logger.info('');
    }

    const success = this.stats.failedTests.length === 0 && !this.hasErrors;
    if (success) {
      logger.info('🎉 All tests passed successfully!');
    } else {
      logger.warn('⚠️  Some tests failed - review output above');
    }

    return success;
  }

  // Get current stats
  getStats() {
    return { ...this.stats };
  }

  // Get current errors
  getErrors() {
    return [...this.errors];
  }
}

module.exports = {
  TestRunner
};
