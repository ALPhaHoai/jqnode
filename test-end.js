const $ = require('./index');

const html = `
  <html>
    <body class="main-body">
      <div id="content" class="content">
        <article class="article"></article>
      </div>
    </body>
  </html>
`;

console.log('Input HTML:', JSON.stringify(html));

const root = $(html);
console.log('Root nodes length:', root.nodes.length);
console.log('Root nodes types:', root.nodes.map(n => n.type + ':' + (n.tagName || (n.value ? n.value.substring(0, 10) : 'no-value'))));

const found = root.find('.article');
console.log('Found nodes length:', found.nodes.length);

const ended = found.end();
console.log('End nodes length:', ended.nodes.length);
console.log('End === root?', ended === root);
console.log('End nodes types:', ended.nodes.map(n => n.type + ':' + (n.tagName || (n.value ? n.value.substring(0, 10) : 'no-value'))));
