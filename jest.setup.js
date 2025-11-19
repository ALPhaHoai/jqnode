const $ = require('./index');

// Clear global root nodes registry before each test to prevent state pollution
beforeEach(() => {
    $.clearRootNodesRegistry();
});
