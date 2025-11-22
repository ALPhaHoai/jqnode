const $ = require('./index');

const html = '<p class="test">Hello</p>';
const element = $(html);
console.log('Element created:', element.nodes.length, 'nodes');
console.log('First node:', element.nodes[0]);
console.log('hasClass("test"):', element.hasClass('test'));
console.log('Element attributes:', element.nodes[0].attributes);
