const jqModule = require('./index');
const $ = jqModule.default || jqModule;

// Clear global root nodes registry before each test to prevent state pollution
beforeEach(() => {
    $.clearRootNodesRegistry();
});
