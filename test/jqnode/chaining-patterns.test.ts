import $ from '../../index';
import { HtmlNode } from '../../types';

describe('Chaining Patterns', () => {
  test('should support basic chaining', () => {
    const chainHtml = `
      <div class="container">
        <input class="input-field" type="text" value="test"/>
        <button class="submit-btn" type="submit">Submit</button>
        <div class="message" data-status="hidden">Message</div>
      </div>
    `;
    const chainRoot = $(chainHtml);

    // Chain find() with attr() getter
    const inputType = chainRoot.find('.input-field').attr('type');
    expect(inputType).toBe('text');

    const buttonType = chainRoot.find('.submit-btn').attr('type');
    expect(buttonType).toBe('submit');

    const messageStatus = chainRoot.find('.message').attr('data-status');
    expect(messageStatus).toBe('hidden');
  });

  test('should support find() and attr() setter chaining', () => {
    const setterHtml = `
      <div class="form">
        <input class="field" type="text" placeholder="Enter value"/>
        <div class="status" data-active="false">Inactive</div>
      </div>
    `;
    const setterRoot = $(setterHtml);

    // Chain find() with attr() setter
    const input = setterRoot.find('.field');
    input.attr('value', 'new value');
    input.attr('data-valid', 'true');

    expect(input.attr('value')).toBe('new value');
    expect(input.attr('data-valid')).toBe('true');

    const status = setterRoot.find('.status');
    status.attr('data-active', 'true');

    expect(status.attr('data-active')).toBe('true');
  });

  test('should support find() and text() chaining', () => {
    const textHtml = `
      <div class="content">
        <h1 class="title">Original Title</h1>
        <p class="description">Original description</p>
        <span class="label">Label</span>
      </div>
    `;
    const textRoot = $(textHtml);

    // Chain find() with text() getter
    const titleText = textRoot.find('.title').text();
    expect(titleText).toBe('Original Title');

    const descText = textRoot.find('.description').text();
    expect(descText).toBe('Original description');

    // Chain find() with text() setter
    textRoot.find('.title').text('Updated Title');
    textRoot.find('.description').text('Updated description');

    const updatedTitle = textRoot.find('.title');
    expect(updatedTitle.text()).toBe('Updated Title');
    const updatedDescription = textRoot.find('.description');
    expect(updatedDescription.text()).toBe('Updated description');
  });

  test('should support find() and html() chaining', () => {
    const htmlChainHtml = `
      <div class="wrapper">
        <div class="box">
          <strong>Original</strong> content
        </div>
        <div class="container">
          <em>Container</em> text
        </div>
      </div>
    `;
    const htmlRoot = $(htmlChainHtml);

    // Chain find() with html() getter
    const boxHtml = htmlRoot.find('.box').html();
    expect(boxHtml).toContain('<strong>Original</strong>');

    const containerHtml = htmlRoot.find('.container').html();
    expect(containerHtml).toContain('<em>Container</em>');
  });

  test('should support complex chaining patterns', () => {
    const complexHtml = `
      <div class="app">
        <header class="header">
          <nav class="nav">
            <ul class="menu">
              <li class="item active">
                <a href="#home" class="link">Home</a>
              </li>
              <li class="item">
                <a href="#about" class="link">About</a>
              </li>
            </ul>
          </nav>
        </header>
        <main class="main">
          <article class="post">
            <h2 class="post-title">Post Title</h2>
            <p class="post-content">Post content</p>
          </article>
        </main>
      </div>
    `;
    const complexRoot = $(complexHtml);

    // Complex chaining: find -> find -> attr/text operations
    const activeLink = complexRoot.find('.item.active').find('.link');
    expect(activeLink.text()).toBe('Home');
    expect(activeLink.attr('href')).toBe('#home');

    const postTitle = complexRoot.find('.post').find('.post-title');
    postTitle.text('Updated Post Title');
    expect(postTitle.text()).toBe('Updated Post Title');

    const postContent = complexRoot.find('.post').find('.post-content');
    postContent.attr('data-length', '12');
    expect(postContent.attr('data-length')).toBe('12');
  });

  test('should support chaining with multiple find() calls', () => {
    const multiFindHtml = `
      <div class="page">
        <section class="section">
          <div class="card">
            <h3 class="card-title">Card 1</h3>
            <p class="card-text">Text 1</p>
          </div>
          <div class="card">
            <h3 class="card-title">Card 2</h3>
            <p class="card-text">Text 2</p>
          </div>
        </section>
        <section class="section">
          <div class="card featured">
            <h3 class="card-title">Card 3</h3>
            <p class="card-text">Text 3</p>
          </div>
        </section>
      </div>
    `;
    const multiRoot = $(multiFindHtml);

    // Chain multiple find() calls
    const allTitles = multiRoot.find('.section').find('.card').find('.card-title');
    expect(allTitles.nodes).toHaveLength(3);

    const featuredCardTitle = multiRoot.find('.section').find('.card.featured').find('.card-title');
    expect(featuredCardTitle.nodes).toHaveLength(1);
    expect(featuredCardTitle.text()).toBe('Card 3');

    // Update through chaining
    multiRoot.find('.section').find('.card').find('.card-title').text('Updated Card');
    const updatedTitles = multiRoot.find('.card-title');
    expect(updatedTitles.nodes).toHaveLength(3);
    // Check that all titles were updated by verifying each one's text content
    const allTitlesUpdated = updatedTitles.nodes.every((node: HtmlNode, index: number) => {
      const nodeText = $(node).text();
      return nodeText === 'Updated Card';
    });
    expect(allTitlesUpdated).toBe(true);
  });

  test('should support chaining with mixed operations', () => {
    const mixedHtml = `
      <form class="form">
        <div class="field-group">
          <label class="label" for="input1">Name</label>
          <input id="input1" class="input" type="text" value="John"/>
        </div>
        <div class="field-group">
          <label class="label" for="input2">Email</label>
          <input id="input2" class="input" type="email" value="john@example.com"/>
        </div>
        <button class="submit" type="submit">Submit</button>
      </form>
    `;
    const mixedRoot = $(mixedHtml);

    // Mix find(), attr(), and text() operations
    const nameInput = mixedRoot.find('#input1'); // Use ID selector instead
    nameInput.attr('placeholder', 'Enter your name');
    expect(nameInput.attr('placeholder')).toBe('Enter your name');

    const emailInput = mixedRoot.find('#input2');
    emailInput.attr('required', true);
    expect(emailInput.attr('required')).toBe('required');

    const submitBtn = mixedRoot.find('.submit');
    submitBtn.text('Send Form');
    submitBtn.attr('data-action', 'submit-form');

    expect(submitBtn.text()).toBe('Send Form');
    expect(submitBtn.attr('data-action')).toBe('submit-form');
  });

  test('should handle chaining with empty results gracefully', () => {
    const emptyHtml = '<div class="container"><span class="item">Content</span></div>';
    const emptyRoot = $(emptyHtml);

    // Chain operations that result in empty sets
    const nonexistent = emptyRoot.find('.nonexistent');
    const furtherChain = nonexistent.find('.anything');

    // These should not throw errors and should return empty
    expect(furtherChain.nodes).toHaveLength(0);
    expect(furtherChain.attr('any')).toBeUndefined();
    expect(furtherChain.text()).toBe('');
    expect(furtherChain.html()).toBeUndefined();
  });

  test('should support jQuery-style fluent interface patterns', () => {
    const fluentHtml = `
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Panel Title</h3>
          <button class="panel-close">×</button>
        </div>
        <div class="panel-body">
          <p class="panel-text">Panel content</p>
        </div>
      </div>
    `;
    const fluentRoot = $(fluentHtml);

    // jQuery-style fluent chaining
    const panel = fluentRoot.filter('.panel');
    const header = panel.find('.panel-header');
    const title = header.find('.panel-title');
    const closeBtn = header.find('.panel-close');

    // Set multiple attributes fluently
    title.attr('data-original', 'Panel Title');
    closeBtn.attr('aria-label', 'Close panel').attr('title', 'Close');

    expect(title.attr('data-original')).toBe('Panel Title');
    expect(closeBtn.attr('aria-label')).toBe('Close panel');
    expect(closeBtn.attr('title')).toBe('Close');

    // Update content fluently
    fluentRoot.find('.panel-text').text('Updated panel content');
    const updatedPanelText = fluentRoot.find('.panel-text');
    expect(updatedPanelText.text()).toBe('Updated panel content');
  });

  test('should support complex jQuery method chaining patterns', () => {
    const complexChainHtml = `
      <div class="app">
        <header class="app-header">
          <nav class="nav">
            <ul class="nav-list">
              <li class="nav-item active">
                <a href="/" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
            </ul>
          </nav>
        </header>
        <main class="main-content">
          <article class="article">
            <h1 class="article-title">Article Title</h1>
            <div class="article-meta">
              <span class="author">Author Name</span>
              <time class="date">2024-01-01</time>
            </div>
            <div class="article-content">
              <p class="article-text">Article content here.</p>
            </div>
          </article>
        </main>
      </div>
    `;
    const complexRoot = $(complexChainHtml);

    // Complex chaining with multiple operations
    const activeNavItem = complexRoot.find('.nav-item.active');
    const navLink = activeNavItem.find('.nav-link');

    // Chain attribute operations
    navLink.attr('data-original-href', navLink.attr('href'))
      .attr('aria-current', 'page');

    expect(navLink.attr('data-original-href')).toBe('/');
    expect(navLink.attr('aria-current')).toBe('page');

    // Chain text operations with find
    const article = complexRoot.find('.article');
    const articleTitle = article.find('.article-title');
    const articleMeta = article.find('.article-meta');

    // Update title and verify chaining
    articleTitle.text('Updated Article Title');
    expect(articleTitle.text()).toBe('Updated Article Title');

    // Chain operations on different elements
    articleMeta.find('.author').attr('data-tooltip', 'Author information');
    articleMeta.find('.date').attr('datetime', '2024-01-01T00:00:00Z');

    const authorElement = articleMeta.find('.author');
    expect(authorElement.attr('data-tooltip')).toBe('Author information');
    const dateElement = articleMeta.find('.date');
    expect(dateElement.attr('datetime')).toBe('2024-01-01T00:00:00Z');
  });

  test('should handle jQuery-style chained selections and manipulations', () => {
    const chainedHtml = `
      <form class="contact-form">
        <div class="form-row">
          <label for="name" class="form-label">Name:</label>
          <input type="text" id="name" class="form-input" name="name">
        </div>
        <div class="form-row">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" class="form-input" name="email">
        </div>
        <div class="form-row">
          <label for="message" class="form-label">Message:</label>
          <textarea id="message" class="form-textarea" name="message"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    `;
    const formRoot = $(chainedHtml);

    // Chain form manipulations
    const form = formRoot.filter('.contact-form');

    // Set multiple input attributes in chain
    form.find('#name').attr('placeholder', 'Enter your name')
      .attr('data-required', 'true');

    form.find('#email').attr('placeholder', 'Enter your email')
      .attr('data-required', 'true');

    form.find('#message').attr('placeholder', 'Enter your message')
      .attr('rows', '5');

    // Verify chained attribute setting
    const nameInput = form.find('#name');
    expect(nameInput.attr('placeholder')).toBe('Enter your name');
    expect(nameInput.attr('data-required')).toBe('true');
    const emailInput = form.find('#email');
    expect(emailInput.attr('placeholder')).toBe('Enter your email');
    expect(emailInput.attr('data-required')).toBe('true');
    const messageTextarea = form.find('#message');
    expect(messageTextarea.attr('rows')).toBe('5');

    // Chain button manipulation
    const submitBtn = form.find('.btn-primary');
    submitBtn.attr('data-loading-text', 'Submitting...')
      .text('Submit Form');

    expect(submitBtn.attr('data-loading-text')).toBe('Submitting...');
    expect(submitBtn.text()).toBe('Submit Form');
  });

  test('should support jQuery-style DOM manipulation chaining', () => {
    const manipHtml = `
      <div class="container">
        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">Widget Title</h3>
            <div class="widget-controls">
              <button class="btn-minimize">-</button>
              <button class="btn-close">×</button>
            </div>
          </div>
          <div class="widget-body">
            <p class="widget-content">Widget content</p>
          </div>
        </div>
      </div>
    `;
    const manipRoot = $(manipHtml);

    // jQuery-style DOM manipulation chaining
    const widget = manipRoot.find('.widget');
    const header = widget.find('.widget-header');
    const title = header.find('.widget-title');
    const controls = header.find('.widget-controls');

    // Chain attribute and content operations
    title.attr('data-original-title', title.text())
      .text('Updated Widget Title');

    controls.find('.btn-minimize').attr('title', 'Minimize widget')
      .attr('aria-label', 'Minimize');

    controls.find('.btn-close').attr('title', 'Close widget')
      .attr('aria-label', 'Close');

    // Chain body content update
    widget.find('.widget-content').text('Updated widget content with more information.');

    // Verify all chained operations
    expect(title.attr('data-original-title')).toBe('Widget Title');
    expect(title.text()).toBe('Updated Widget Title');

    const minimizeBtn = controls.find('.btn-minimize');
    expect(minimizeBtn.attr('title')).toBe('Minimize widget');
    expect(minimizeBtn.attr('aria-label')).toBe('Minimize');

    const closeBtn = controls.find('.btn-close');
    expect(closeBtn.attr('title')).toBe('Close widget');
    expect(closeBtn.attr('aria-label')).toBe('Close');

    const widgetContent = widget.find('.widget-content');
    expect(widgetContent.text()).toBe('Updated widget content with more information.');
  });

  test('should handle jQuery-style event-like attribute chaining', () => {
    const eventHtml = `
      <div class="interactive">
        <button class="action-btn" id="save-btn">Save</button>
        <button class="action-btn" id="cancel-btn">Cancel</button>
        <a href="#" class="link" id="help-link">Help</a>
        <input type="checkbox" class="toggle" id="auto-save">
      </div>
    `;
    const eventRoot = $(eventHtml);

    // Simulate jQuery event attribute chaining
    const saveBtn = eventRoot.find('#save-btn');
    const cancelBtn = eventRoot.find('#cancel-btn');
    const helpLink = eventRoot.find('#help-link');
    const autoSave = eventRoot.find('#auto-save');

    // Chain event-related attributes
    saveBtn.attr('data-action', 'save')
      .attr('data-confirm', 'Are you sure?')
      .attr('aria-pressed', 'false');

    cancelBtn.attr('data-action', 'cancel')
      .attr('data-dismiss', 'true')
      .attr('aria-label', 'Cancel operation');

    helpLink.attr('data-toggle', 'tooltip')
      .attr('data-placement', 'top')
      .attr('aria-describedby', 'help-tooltip');

    autoSave.attr('data-toggle', 'autosave')
      .attr('aria-checked', 'false');

    // Verify chained event attributes
    expect(saveBtn.attr('data-action')).toBe('save');
    expect(saveBtn.attr('data-confirm')).toBe('Are you sure?');
    expect(saveBtn.attr('aria-pressed')).toBe('false');

    expect(cancelBtn.attr('data-action')).toBe('cancel');
    expect(cancelBtn.attr('data-dismiss')).toBe('true');
    expect(cancelBtn.attr('aria-label')).toBe('Cancel operation');

    expect(helpLink.attr('data-toggle')).toBe('tooltip');
    expect(helpLink.attr('data-placement')).toBe('top');
    expect(helpLink.attr('aria-describedby')).toBe('help-tooltip');

    expect(autoSave.attr('data-toggle')).toBe('autosave');
    expect(autoSave.attr('aria-checked')).toBe('false');
  });

  test('should support jQuery-style chained selections with filtering', () => {
    const filterHtml = `
      <div class="product-list">
        <div class="product-item featured" data-category="electronics">
          <h4 class="product-name">Laptop</h4>
          <span class="product-price">$999</span>
          <span class="product-status">In Stock</span>
        </div>
        <div class="product-item" data-category="electronics">
          <h4 class="product-name">Mouse</h4>
          <span class="product-price">$25</span>
          <span class="product-status">In Stock</span>
        </div>
        <div class="product-item featured" data-category="books">
          <h4 class="product-name">JavaScript Guide</h4>
          <span class="product-price">$49</span>
          <span class="product-status">Out of Stock</span>
        </div>
        <div class="product-item" data-category="books">
          <h4 class="product-name">CSS Manual</h4>
          <span class="product-price">$39</span>
          <span class="product-status">In Stock</span>
        </div>
      </div>
    `;
    const filterRoot = $(filterHtml);

    // Chain selections with filtering operations
    const allProducts = filterRoot.find('.product-item');
    expect(allProducts.nodes).toHaveLength(4);

    const featuredProducts = filterRoot.find('.product-item.featured');
    expect(featuredProducts.nodes).toHaveLength(2);

    const electronics = filterRoot.find('.product-item[data-category="electronics"]');
    expect(electronics.nodes).toHaveLength(2); // Attribute selectors are supported

    // Work with supported selectors
    const productNames = filterRoot.find('.product-name');
    expect(productNames.nodes).toHaveLength(4);

    const productPrices = filterRoot.find('.product-price');
    expect(productPrices.nodes).toHaveLength(4);

    // Chain attribute operations on multiple elements
    featuredProducts.find('.product-price').attr('data-discount', '10%');
    featuredProducts.find('.product-status').attr('data-priority', 'high');

    // Verify attribute chaining on filtered results
    const featuredPrices = featuredProducts.find('.product-price');
    expect(featuredPrices.nodes).toHaveLength(2);
    const allPricesDiscounted = featuredPrices.nodes.every((node: HtmlNode) => $(node).attr('data-discount') === '10%');
    expect(allPricesDiscounted).toBe(true);

    const featuredStatuses = featuredProducts.find('.product-status');
    expect(featuredStatuses.nodes).toHaveLength(2);
    const allStatusesHighPriority = featuredStatuses.nodes.every((node: HtmlNode) => $(node).attr('data-priority') === 'high');
    expect(allStatusesHighPriority).toBe(true);
  });
});
