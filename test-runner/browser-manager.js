/**
 * Browser Manager module for jqnode test runner
 * Handles browser automation for both Playwright and MCP browser extension
 */

const { BrowserError, sleep, CleanupRegistry } = require('./utils');
const { config } = require('./config');
const { logger } = require('./logger');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
    this.cleanupRegistry = new CleanupRegistry();
  }

  async initialize() {
    try {
      if (config.get('browserEngine') === 'mcp') {
        await this.initializeMCPBrowser();
      } else {
        await this.initializePlaywrightBrowser();
      }
    } catch (error) {
      throw new BrowserError(`Failed to initialize browser: ${error.message}`);
    }
  }

  async initializePlaywrightBrowser() {
    logger.debug('Initializing Playwright browser...');

    const playwright = require('playwright');
    this.browser = await playwright.chromium.launch();
    this.context = await this.browser.newContext();

    // Register cleanup
    this.cleanupRegistry.register(async () => {
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    });

    logger.debug('Playwright browser initialized successfully');
  }

  async initializeMCPBrowser() {
    logger.debug('Initializing MCP browser...');

    try {
      // Navigate to the test page
      await this.mcpNavigate('http://127.0.0.1:8080/browser-test/all-tests/index.html');
      logger.info('MCP browser initialized successfully');
    } catch (error) {
      throw new BrowserError(`Failed to initialize MCP browser: ${error.message}`);
    }
  }

  async close() {
    await this.cleanupRegistry.cleanup();
  }

  // MCP Browser methods
  async mcpNavigate(url) {
    logger.browserNavigate(url);

    try {
      await mcp_cursor_browser_extension_browser_navigate({ url });
    } catch (error) {
      throw new BrowserError(`Failed to navigate to ${url}: ${error.message}`);
    }
  }

  async mcpClick(element, selector) {
    logger.browserClick(element, selector);

    try {
      await mcp_cursor_browser_extension_browser_click({
        element,
        ref: selector
      });
    } catch (error) {
      throw new BrowserError(`Failed to click ${element} (${selector}): ${error.message}`);
    }
  }

  async mcpSelectOption(element, selector, values) {
    logger.debug(`Selecting option in ${element}: ${values.join(', ')}`);

    try {
      await mcp_cursor_browser_extension_browser_select_option({
        element,
        ref: selector,
        values
      });
    } catch (error) {
      throw new BrowserError(`Failed to select option in ${element}: ${error.message}`);
    }
  }

  async mcpWait(timeMs) {
    logger.browserWait(`fixed delay`, timeMs);

    try {
      await mcp_cursor_browser_extension_browser_wait_for({ time: timeMs / 1000 });
    } catch (error) {
      throw new BrowserError(`Wait failed: ${error.message}`);
    }
  }

  async mcpEvaluate(functionCode) {
    try {
      const result = await mcp_cursor_browser_extension_browser_evaluate({
        function: `(${functionCode})()`
      });
      return result;
    } catch (error) {
      throw new BrowserError(`Evaluation failed: ${error.message}`);
    }
  }

  async mcpGetConsoleMessages() {
    try {
      const messages = await mcp_cursor_browser_extension_browser_console_messages();
      return messages || [];
    } catch (error) {
      logger.warn(`Could not get console messages: ${error.message}`);
      return [];
    }
  }

  // Element interaction helpers
  async waitForElement(selector, timeout = 10000) {
    logger.browserWait(`element ${selector} to exist`, timeout);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const result = await this.mcpEvaluate(`
          return !!document.querySelector('${selector}')
        `);
        if (result) return;
      } catch (error) {
        // Continue waiting
      }
      await sleep(100);
    }
    throw new BrowserError(`Element ${selector} not found within ${timeout}ms`);
  }

  async waitForTestResults(timeout = 15000) {
    logger.browserWait('test results to appear', timeout);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const totalText = await this.getElementText('#totalTests');
        const total = parseInt(totalText) || 0;
        if (total > 0) return; // Results have appeared
      } catch (error) {
        // Continue waiting
      }
      await sleep(500);
    }
    throw new BrowserError(`Test results did not appear within ${timeout}ms`);
  }

  async getElementText(selector) {
    try {
      const result = await this.mcpEvaluate(`
        const el = document.querySelector('${selector}');
        return el ? el.textContent : '0';
      `);
      return result || '0';
    } catch (error) {
      logger.warn(`Could not get element text for ${selector}: ${error.message}`);
      return '0';
    }
  }

  async getFailedTestNames() {
    try {
      const result = await this.mcpEvaluate(`
        const failedElements = document.querySelectorAll('.test-result.failed .test-name');
        return Array.from(failedElements).map(el => el.textContent);
      `);
      return result || [];
    } catch (error) {
      logger.warn(`Could not get failed test names: ${error.message}`);
      return [];
    }
  }

  // Playwright browser methods
  async playwrightNavigate(url) {
    logger.browserNavigate(url);

    const page = await this.context.newPage();
    try {
      await page.goto(url);
      await page.waitForTimeout(1000);
      return page;
    } catch (error) {
      await page.close();
      throw new BrowserError(`Failed to navigate to ${url}: ${error.message}`);
    }
  }

  async playwrightClick(page, selector, options = {}) {
    logger.browserClick('element', selector);

    try {
      await page.click(selector, options);
    } catch (error) {
      throw new BrowserError(`Failed to click ${selector}: ${error.message}`);
    }
  }

  async playwrightWaitForFunction(page, fn, options = {}) {
    try {
      await page.waitForFunction(fn, options);
    } catch (error) {
      throw new BrowserError(`Wait for function failed: ${error.message}`);
    }
  }

  async playwrightEvaluate(page, functionCode) {
    try {
      return await page.evaluate(functionCode);
    } catch (error) {
      throw new BrowserError(`Page evaluation failed: ${error.message}`);
    }
  }

  // Unified test execution methods
  async runMCPBrowserTest(fileName) {
    logger.testStart(`MCP Browser: ${fileName}`);

    try {
      // Encode backslashes for URL
      const encodedFile = fileName.replace(/\\/g, '%5C');
      const url = `http://127.0.0.1:8080/browser-test/all-tests/index.html?library=jqnode&file=${encodedFile}`;

      // Navigate to the specific test
      await this.mcpNavigate(url);

      // Wait for page to load and be ready
      await this.mcpWait(2000);
      await this.waitForElement('#runFileBtn', 10000);

      // Run with jqnode first
      logger.debug('Running with jqnode...');
      await this.mcpClick('Run Selected File button', '#runFileBtn');

      // Wait for tests to complete
      await this.waitForTestResults(15000);

      // Get jqnode results
      const nqTotal = await this.getElementText('#totalTests');
      const nqPassed = await this.getElementText('#passedTests');
      const nqFailed = await this.getElementText('#failedTests');

      logger.info(`jqnode: ${nqPassed}/${nqTotal} passed, ${nqFailed} failed`);

      // Switch to jQuery and run same test
      logger.debug('Switching to jQuery...');
      await this.mcpSelectOption('Library selector', '#librarySelector', ['jquery']);
      await this.mcpWait(1000);

      await this.mcpClick('Run Selected File button', '#runFileBtn');
      await this.waitForTestResults(15000);

      // Get jQuery results
      const jqTotal = await this.getElementText('#totalTests');
      const jqPassed = await this.getElementText('#passedTests');
      const jqFailed = await this.getElementText('#failedTests');

      logger.info(`jQuery: ${jqPassed}/${jqTotal} passed, ${jqFailed} failed`);

      // Get console messages and failed tests
      const consoleMessages = await this.mcpGetConsoleMessages();
      const consoleErrors = consoleMessages.filter(msg => msg.type === 'error').map(msg => msg.text);
      const failedTests = await this.getFailedTestNames();

      const result = {
        file: fileName,
        nodeQuery: {
          total: parseInt(nqTotal) || 0,
          passed: parseInt(nqPassed) || 0,
          failed: parseInt(nqFailed) || 0
        },
        jQuery: {
          total: parseInt(jqTotal) || 0,
          passed: parseInt(jqPassed) || 0,
          failed: parseInt(jqFailed) || 0
        },
        consoleErrors: consoleErrors,
        failedTests: failedTests,
        mismatch: (parseInt(nqPassed) || 0) !== (parseInt(jqPassed) || 0) ||
          (parseInt(nqFailed) || 0) !== (parseInt(jqFailed) || 0)
      };

      if (result.mismatch) {
        logger.warn(`MISMATCH: jqnode results differ from jQuery!`);
      }

      if (result.consoleErrors.length > 0) {
        logger.error(`Console errors: ${result.consoleErrors.join(', ')}`);
      }

      if (result.failedTests.length > 0) {
        logger.error(`Failed tests: ${result.failedTests.join(', ')}`);
      }

      return result;

    } catch (error) {
      logger.testFail(`MCP Browser: ${fileName}`, error);
      return {
        file: fileName,
        error: error.message
      };
    }
  }

  async runPlaywrightBrowserTest(fileName) {
    logger.testStart(`Playwright Browser: ${fileName}`);

    const page = await this.context.newPage();

    try {
      const encodedFile = fileName.replace(/\\/g, '%5C');
      const url = `http://127.0.0.1:8080/browser-test/all-tests/index.html?library=jqnode&file=${encodedFile}`;

      await page.goto(url);
      await page.waitForTimeout(1000);

      await this.playwrightClick(page, '#runFileBtn');
      await this.playwrightWaitForFunction(page, () => {
        const totalTests = document.getElementById('totalTests');
        return totalTests && totalTests.textContent !== '0';
      }, { timeout: config.get('timeout') });

      const nqTotal = await page.$eval('#totalTests', el => el.textContent);
      const nqPassed = await page.$eval('#passedTests', el => el.textContent);
      const nqFailed = await page.$eval('#failedTests', el => el.textContent);

      // Switch to jQuery for comparison
      await page.selectOption('#librarySelector', 'jquery');
      await page.waitForTimeout(500);
      await this.playwrightClick(page, '#runFileBtn');

      await this.playwrightWaitForFunction(page, () => {
        const totalTests = document.getElementById('totalTests');
        return totalTests && totalTests.textContent !== '0';
      }, { timeout: config.get('timeout') });

      const jqTotal = await page.$eval('#totalTests', el => el.textContent);
      const jqPassed = await page.$eval('#passedTests', el => el.textContent);
      const jqFailed = await page.$eval('#failedTests', el => el.textContent);

      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const errorText = msg.text();
          if (!errorText.includes('404')) {
            consoleErrors.push(errorText);
          }
        }
      });

      await page.waitForTimeout(2000);

      const failedTests = await page.$$eval('.test-result.failed .test-name', elements =>
        elements.map(el => el.textContent)
      );

      const result = {
        file: fileName,
        nodeQuery: { total: parseInt(nqTotal), passed: parseInt(nqPassed), failed: parseInt(nqFailed) },
        jQuery: { total: parseInt(jqTotal), passed: parseInt(jqPassed), failed: parseInt(jqFailed) },
        consoleErrors: consoleErrors,
        failedTests: failedTests,
        mismatch: nqPassed !== jqPassed || nqFailed !== jqFailed
      };

      logger.info(`Browser: ${nqPassed}/${nqTotal} passed (${jqPassed}/${jqTotal} jQuery)`);

      return result;

    } catch (error) {
      logger.testFail(`Playwright Browser: ${fileName}`, error);
      return { file: fileName, error: error.message };
    } finally {
      await page.close();
    }
  }

  async runBrowserTest(fileName) {
    if (config.get('browserEngine') === 'mcp') {
      return await this.runMCPBrowserTest(fileName);
    } else {
      return await this.runPlaywrightBrowserTest(fileName);
    }
  }
}

module.exports = {
  BrowserManager
};
