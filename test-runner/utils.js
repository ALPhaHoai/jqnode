/**
 * Utilities module for node-query test runner
 * Contains shared utilities, error handling, and helper functions
 */

const path = require('path');
const fs = require('fs');

/**
 * Custom error classes
 */
class TestRunnerError extends Error {
  constructor(message, code = 'TEST_RUNNER_ERROR') {
    super(message);
    this.name = 'TestRunnerError';
    this.code = code;
  }
}

class BrowserError extends TestRunnerError {
  constructor(message) {
    super(message, 'BROWSER_ERROR');
    this.name = 'BrowserError';
  }
}

class ProcessError extends TestRunnerError {
  constructor(message, exitCode) {
    super(message, 'PROCESS_ERROR');
    this.name = 'ProcessError';
    this.exitCode = exitCode;
  }
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate file path and check if it exists
 */
function validateFilePath(filePath, description = 'file') {
  if (!filePath) {
    throw new TestRunnerError(`${description} path is required`);
  }

  if (typeof filePath !== 'string') {
    throw new TestRunnerError(`${description} path must be a string`);
  }

  // Basic path traversal protection
  if (filePath.includes('..') || path.isAbsolute(filePath) && !filePath.startsWith(process.cwd())) {
    throw new TestRunnerError(`Invalid ${description} path: ${filePath}`);
  }

  return filePath;
}

/**
 * Safely read file with error handling
 */
function safeReadFile(filePath, options = {}) {
  try {
    validateFilePath(filePath, 'file');
    return fs.readFileSync(filePath, options);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new TestRunnerError(`File not found: ${filePath}`);
    }
    throw new TestRunnerError(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    validateFilePath(filePath, 'file');
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Create directory recursively
 */
function ensureDirectory(dirPath) {
  try {
    validateFilePath(dirPath, 'directory');
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (error) {
    throw new TestRunnerError(`Failed to create directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Parse test results from Jest output
 */
function parseTestResults(output) {
  if (!output || typeof output !== 'string') {
    return { passed: 0, total: 0 };
  }

  const match = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
  if (match) {
    return {
      passed: parseInt(match[1], 10),
      total: parseInt(match[2], 10)
    };
  }

  // Fallback parsing
  return {
    passed: output.includes('PASS') ? 1 : 0,
    total: output.includes('PASS') || output.includes('FAIL') ? 1 : 0
  };
}

/**
 * Compare results between different test types
 */
function compareResults(nodeResults, browserResults, jqueryResults, testFile) {
  console.log(`🔄 Comparing ${testFile} results:`);
  console.log(`   Node.js: ${nodeResults.success ? 'PASS' : 'FAIL'}`);
  console.log(`   Browser: ${browserResults.success ? 'PASS' : 'FAIL'}`);
  console.log(`   jQuery: ${jqueryResults.success ? 'PASS' : 'FAIL'}`);

  const allMatch = nodeResults.success === browserResults.success &&
                   nodeResults.success === jqueryResults.success;

  if (!allMatch) {
    console.log(`⚠️  MISMATCH: Test results differ for ${testFile}`);
    return false;
  }

  console.log(`✅ MATCH: All test types ${nodeResults.success ? 'passed' : 'failed'}`);
  return true;
}

/**
 * Get test file paths from test file object
 */
function getTestPaths(testFileObj) {
  if (!testFileObj || typeof testFileObj !== 'object') {
    throw new TestRunnerError('Invalid test file object');
  }

  return {
    nodeTestPath: testFileObj.nodeTestPath,
    jqueryTestPath: testFileObj.jqueryTestPath,
    relativePath: testFileObj.relativePath,
    windowsPath: testFileObj.windowsPath
  };
}

/**
 * Validate URL format
 */
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Format duration in milliseconds
 */
function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    backoffFactor = 2,
    maxDelay = 10000,
    retryCondition = () => true
  } = options;

  let attempt = 0;
  let delay = initialDelay;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt >= maxAttempts || !retryCondition(error)) {
        throw error;
      }

      await sleep(delay);
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }
}

/**
 * Cleanup function registry for resource management
 */
class CleanupRegistry {
  constructor() {
    this.cleanupFunctions = [];
  }

  register(fn) {
    if (typeof fn === 'function') {
      this.cleanupFunctions.push(fn);
    }
  }

  async cleanup() {
    const errors = [];
    for (const cleanupFn of this.cleanupFunctions.reverse()) {
      try {
        await cleanupFn();
      } catch (error) {
        errors.push(error);
      }
    }
    this.cleanupFunctions = [];

    if (errors.length > 0) {
      throw new TestRunnerError(`Cleanup failed: ${errors.map(e => e.message).join(', ')}`);
    }
  }
}

module.exports = {
  // Error classes
  TestRunnerError,
  BrowserError,
  ProcessError,

  // Utilities
  sleep,
  validateFilePath,
  safeReadFile,
  fileExists,
  ensureDirectory,
  parseTestResults,
  compareResults,
  getTestPaths,
  validateUrl,
  formatDuration,
  deepClone,
  retryWithBackoff,
  CleanupRegistry
};