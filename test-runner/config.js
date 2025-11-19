/**
 * Configuration module for jqnode test runner
 * Handles environment variables, CLI arguments, and configuration validation
 */

class ConfigurationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ConfigurationError';
    this.field = field;
  }
}

class Config {
  constructor() {
    this.config = {};
    this.loadConfig();
    this.validateConfig();
  }

  loadConfig() {
    // Load environment variables with validation
    this.config = {
      delay: this.parseIntEnv('TEST_DELAY', 1000),
      timeout: this.parseIntEnv('TEST_TIMEOUT', 30000),
      includeBrowserUrls: this.parseBooleanEnv('INCLUDE_BROWSER_URLS', true),
      failFast: this.parseBooleanEnv('FAIL_FAST', false),
      retryOnFailure: this.parseBooleanEnv('RETRY_ON_FAILURE', true),
      maxIterations: this.parseIntEnv('MAX_ITERATIONS', 10),
      browserEngine: this.validateBrowserEngine(process.env.BROWSER_ENGINE || 'playwright'),
      interactiveMode: this.parseBooleanEnv('INTERACTIVE_MODE', false),
      // CLI override flags (set by CLI parser)
      skipNode: false,
      skipBrowser: false,
      skipJQuery: false
    };
  }

  parseIntEnv(varName, defaultValue) {
    const value = process.env[varName];
    if (value === undefined) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new ConfigurationError(
        `Environment variable ${varName} must be a valid integer, got: ${value}`,
        varName
      );
    }
    return parsed;
  }

  parseBooleanEnv(varName, defaultValue) {
    const value = process.env[varName];
    if (value === undefined) return defaultValue;

    const lowerValue = value.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(lowerValue)) return true;
    if (['false', '0', 'no', 'off'].includes(lowerValue)) return false;

    throw new ConfigurationError(
      `Environment variable ${varName} must be a boolean (true/false), got: ${value}`,
      varName
    );
  }

  validateBrowserEngine(engine) {
    const validEngines = ['playwright', 'mcp'];
    if (!validEngines.includes(engine)) {
      throw new ConfigurationError(
        `Browser engine must be one of: ${validEngines.join(', ')}, got: ${engine}`,
        'BROWSER_ENGINE'
      );
    }
    return engine;
  }

  validateConfig() {
    // Validate ranges
    if (this.config.delay < 0) {
      throw new ConfigurationError('Delay must be non-negative', 'TEST_DELAY');
    }

    if (this.config.timeout < 1000) {
      throw new ConfigurationError('Timeout must be at least 1000ms', 'TEST_TIMEOUT');
    }

    if (this.config.maxIterations < 1 || this.config.maxIterations > 100) {
      throw new ConfigurationError('Max iterations must be between 1 and 100', 'MAX_ITERATIONS');
    }
  }

  // Update config with CLI arguments
  updateFromCli(cliArgs) {
    this.config.skipNode = cliArgs.includes('--skip-node');
    this.config.skipBrowser = cliArgs.includes('--skip-browser');
    this.config.skipJQuery = cliArgs.includes('--skip-jquery');
  }

  // Get config value
  get(key) {
    return this.config[key];
  }

  // Set config value
  set(key, value) {
    this.config[key] = value;
  }

  // Get all config
  getAll() {
    return { ...this.config };
  }

  // Print configuration summary
  printSummary() {
    console.log('🚀 Configuration:');
    console.log(`   Delay between tests: ${this.config.delay}ms`);
    console.log(`   Test timeout: ${this.config.timeout}ms`);
    console.log(`   Browser URLs: ${this.config.includeBrowserUrls ? 'enabled' : 'disabled'}`);
    console.log(`   Fail fast: ${this.config.failFast ? 'enabled' : 'disabled'}`);
    console.log(`   Retry on failure: ${this.config.retryOnFailure ? 'enabled' : 'disabled'}`);
    console.log(`   Max iterations: ${this.config.maxIterations}`);
    console.log(`   Browser engine: ${this.config.browserEngine}`);
    console.log(`   Interactive mode: ${this.config.interactiveMode ? 'enabled' : 'disabled'}`);
    console.log(`   Skip Node.js: ${this.config.skipNode ? 'YES' : 'NO'}`);
    console.log(`   Skip Browser: ${this.config.skipBrowser ? 'YES' : 'NO'}`);
    console.log(`   Skip jQuery: ${this.config.skipJQuery ? 'YES' : 'NO'}`);
    console.log('');
  }
}

// Export singleton instance
const config = new Config();

module.exports = {
  config,
  Config,
  ConfigurationError
};
