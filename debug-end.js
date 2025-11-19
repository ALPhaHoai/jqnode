const $ = require('./index');

const html = `
  <html>
    <body class="main-body">
      <div id="content" class="content">
        <section class="section">
          <article class="article">
            <h2 class="article-title">Article 1</h2>
            <p class="paragraph">First paragraph <span class="highlight">with span</span></p>
            <div class="nested">
              <p class="inner-para">Inner paragraph</p>
              <span class="inner-span">Inner span</span>
            </div>
          </article>
        </section>
        <aside class="sidebar">
          <h3 class="sidebar-title">Sidebar</h3>
          <ul class="list">
            <li class="list-item">Item 1</li>
            <li class="list-item">Item 2</li>
          </ul>
        </aside>
      </div>
    </body>
  </html>
`;

const root = $(html);
console.log('Root nodes length:', root.nodes.length);
console.log('Root node type:', root.nodes[0].type, 'tagName:', root.nodes[0].tagName);

const found = root.find('.highlight');
console.log('Found .highlight nodes length:', found.nodes.length);

if (found.nodes.length > 0) {
    console.log('Found node type:', found.nodes[0].type);
    console.log('Found node tagName:', found.nodes[0].tagName);
    console.log('Found node attributes:', JSON.stringify(found.nodes[0].attributes, null, 2));
    console.log('Found node text:', found.nodes[0].children ? found.nodes[0].children.map(c => c.value || c.tagName).join('') : 'no children');
}

const endResult = found.end();
console.log('End result nodes length:', endResult.nodes.length);
console.log('End result is same as root?', endResult === root);
