/**
 * Logging module for jqnode test runner
 * Provides structured logging with levels, colors, and formatting
 */

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};

const LOG_LEVEL_NAMES = {
    [LOG_LEVELS.ERROR]: 'ERROR',
    [LOG_LEVELS.WARN]: 'WARN',
    [LOG_LEVELS.INFO]: 'INFO',
    [LOG_LEVELS.DEBUG]: 'DEBUG',
};

class Logger {
    constructor(options = {}) {
        this.level = options.level || LOG_LEVELS.INFO;
        this.useColors = options.useColors !== false;
        this.showTimestamps = options.showTimestamps || false;
        this.prefix = options.prefix || '';
    }

    // Check if log level should be displayed
    shouldLog(level) {
        return level <= this.level;
    }

    // Format log message
    formatMessage(level, message, ...args) {
        const levelName = LOG_LEVEL_NAMES[level];
        const timestamp = this.showTimestamps ? `[${new Date().toISOString()}] ` : '';
        const prefix = this.prefix ? `[${this.prefix}] ` : '';

        let formatted = `${timestamp}${prefix}${levelName}: ${message}`;

        if (args.length > 0) {
            formatted +=
                ' ' +
                args
                    .map((arg) =>
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg),
                    )
                    .join(' ');
        }

        return formatted;
    }

    // Get color for log level
    getLevelColor(level) {
        if (!this.useColors) return '';

        switch (level) {
            case LOG_LEVELS.ERROR:
                return colors.red;
            case LOG_LEVELS.WARN:
                return colors.yellow;
            case LOG_LEVELS.INFO:
                return colors.blue;
            case LOG_LEVELS.DEBUG:
                return colors.dim;
            default:
                return '';
        }
    }

    // Core logging method
    log(level, message, ...args) {
        if (!this.shouldLog(level)) return;

        const color = this.getLevelColor(level);
        const formatted = this.formatMessage(level, message, ...args);

        const output = color ? `${color}${formatted}${colors.reset}` : formatted;
        console.log(output);
    }

    // Convenience methods
    error(message, ...args) {
        this.log(LOG_LEVELS.ERROR, message, ...args);
    }

    warn(message, ...args) {
        this.log(LOG_LEVELS.WARN, message, ...args);
    }

    info(message, ...args) {
        this.log(LOG_LEVELS.INFO, message, ...args);
    }

    debug(message, ...args) {
        this.log(LOG_LEVELS.DEBUG, message, ...args);
    }

    // Specialized test logging methods
    testStart(testName) {
        this.info(`🧪 Starting test: ${testName}`);
    }

    testPass(testName, duration) {
        const durationStr = duration ? ` (${duration}ms)` : '';
        this.info(`✅ Test passed: ${testName}${durationStr}`);
    }

    testFail(testName, error) {
        this.error(`❌ Test failed: ${testName}`);
        if (error) {
            this.error(`   Error: ${error.message || error}`);
        }
    }

    browserNavigate(url) {
        this.debug(`🌐 Navigating to: ${url}`);
    }

    browserClick(element, selector) {
        this.debug(`🖱️  Clicking: ${element} (${selector})`);
    }

    browserWait(description, timeout) {
        this.debug(`⏳ Waiting for: ${description} (${timeout}ms)`);
    }

    resultsSummary(results) {
        this.info('📊 Test Results Summary:');
        this.info(`   Total files: ${results.total}`);
        this.info(`   Processed: ${results.processed}`);

        if (!results.skipNode && results.nodeResults) {
            this.info(
                `   Node.js: ${results.nodeResults.passed}/${results.nodeResults.passed + results.nodeResults.failed} passed`,
            );
        }

        if (!results.skipBrowser && results.browserResults) {
            this.info(
                `   Browser: ${results.browserResults.passed}/${results.browserResults.passed + results.browserResults.failed} passed`,
            );
        }

        if (!results.skipJQuery && results.jqueryResults) {
            this.info(
                `   jQuery: ${results.jqueryResults.passed}/${results.jqueryResults.passed + results.jqueryResults.failed} passed`,
            );
        }

        if (results.mismatches && results.mismatches.length > 0) {
            this.warn(`   ⚠️  Mismatches: ${results.mismatches.length}`);
        }
    }
}

// Create default logger instance
const logger = new Logger();

// Export logger and utilities
module.exports = {
    Logger,
    logger,
    LOG_LEVELS,
    LOG_LEVEL_NAMES,
};
