import $ from '../../index';
import jQuery from 'jquery';
import { createTestDom, compareResults } from '../utils/jquery-comparison-helpers';

describe('jQuery method chaining patterns - Node-Query vs jQuery Comparison', () => {
  test('should support find() and attr() chaining - jquery-comparison', () => {
    const chainHtml = `
      <div class="container">
        <input type="text" class="input-field" name="username" value="test"/>
        <button class="submit-btn" type="submit">Submit</button>
        <div class="message" data-status="hidden">Message</div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(chainHtml);

    // Chain find() with attr() getter
    const nqInputType = nqRoot.find('.input-field').attr('type');
    const jqInputType = jqRoot.find('.input-field').attr('type');
    expect(nqInputType).toBe(jqInputType);
    expect(nqInputType).toBe('text');

    const nqButtonType = nqRoot.find('.submit-btn').attr('type');
    const jqButtonType = jqRoot.find('.submit-btn').attr('type');
    expect(nqButtonType).toBe(jqButtonType);
    expect(nqButtonType).toBe('submit');

    const nqMessageStatus = nqRoot.find('.message').attr('data-status');
    const jqMessageStatus = jqRoot.find('.message').attr('data-status');
    expect(nqMessageStatus).toBe(jqMessageStatus);
    expect(nqMessageStatus).toBe('hidden');
  });

  test('should support find() and attr() setter chaining - jquery-comparison', () => {
    const setterHtml = `
      <div class="form">
        <input class="field" type="text" placeholder="Enter value"/>
        <div class="status" data-active="false">Inactive</div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(setterHtml);

    // Chain find() with attr() setter
    const nqInput = nqRoot.find('.field');
    const jqInput = jqRoot.find('.field');
    nqInput.attr('value', 'new value');
    jqInput.attr('value', 'new value');
    nqInput.attr('data-valid', 'true');
    jqInput.attr('data-valid', 'true');

    const nqValue = nqInput.attr('value');
    const jqValue = jqInput.attr('value');
    expect(nqValue).toBe(jqValue);
    expect(nqValue).toBe('new value');

    const nqDataValid = nqInput.attr('data-valid');
    const jqDataValid = jqInput.attr('data-valid');
    expect(nqDataValid).toBe(jqDataValid);
    expect(nqDataValid).toBe('true');

    const nqStatus = nqRoot.find('.status');
    const jqStatus = jqRoot.find('.status');
    nqStatus.attr('data-active', 'true');
    jqStatus.attr('data-active', 'true');

    const nqActive = nqStatus.attr('data-active');
    const jqActive = jqStatus.attr('data-active');
    expect(nqActive).toBe(jqActive);
    expect(nqActive).toBe('true');
  });

  test('should support find() and text() chaining - jquery-comparison', () => {
    const textHtml = `
      <div class="content">
        <h1 class="title">Original Title</h1>
        <p class="description">Original description</p>
        <span class="label">Label</span>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(textHtml);

    // Chain find() with text() getter
    const nqTitleText = nqRoot.find('.title').text();
    const jqTitleText = jqRoot.find('.title').text();
    expect(nqTitleText).toBe(jqTitleText);
    expect(nqTitleText).toBe('Original Title');

    const nqDescText = nqRoot.find('.description').text();
    const jqDescText = jqRoot.find('.description').text();
    expect(nqDescText).toBe(jqDescText);
    expect(nqDescText).toBe('Original description');

    // Chain find() with text() setter
    nqRoot.find('.title').text('Updated Title');
    jqRoot.find('.title').text('Updated Title');

    const nqUpdatedTitle = nqRoot.find('.title').text();
    const jqUpdatedTitle = jqRoot.find('.title').text();
    expect(nqUpdatedTitle).toBe(jqUpdatedTitle);
    expect(nqUpdatedTitle).toBe('Updated Title');

    nqRoot.find('.description').text('Updated description text');
    jqRoot.find('.description').text('Updated description text');

    const nqUpdatedDesc = nqRoot.find('.description').text();
    const jqUpdatedDesc = jqRoot.find('.description').text();
    expect(nqUpdatedDesc).toBe(jqUpdatedDesc);
    expect(nqUpdatedDesc).toBe('Updated description text');
  });

  test('should support find() and html() chaining - jquery-comparison', () => {
    const htmlContent = `
      <div class="wrapper">
        <div class="inner"><strong>Bold text</strong></div>
        <p class="para">Simple paragraph</p>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(htmlContent);

    // Chain find() with html() getter
    const nqInnerHtml = nqRoot.find('.inner').html();
    const jqInnerHtml = jqRoot.find('.inner').html();
    expect(nqInnerHtml).toBe(jqInnerHtml);

    const nqParaHtml = nqRoot.find('.para').html();
    const jqParaHtml = jqRoot.find('.para').html();
    expect(nqParaHtml).toBe(jqParaHtml);
    expect(nqParaHtml).toBe('Simple paragraph');

    // Chain find() with html() setter
    const nqInnerElement = nqRoot.find('.inner');
    const jqInnerElement = jqRoot.find('.inner');

    nqInnerElement.html('<em>Italic text</em>');
    jqInnerElement.html('<em>Italic text</em>');

    const nqUpdatedInner = nqInnerElement.html();
    const jqUpdatedInner = jqInnerElement.html();
    expect(nqUpdatedInner).toBe(jqUpdatedInner);
    expect(nqUpdatedInner).toBe('<em>Italic text</em>');

    const nqParaElement = nqRoot.find('.para');
    const jqParaElement = jqRoot.find('.para');

    nqParaElement.html('<span>Updated</span> content');
    jqParaElement.html('<span>Updated</span> content');

    const nqUpdatedPara = nqParaElement.html();
    const jqUpdatedPara = jqParaElement.html();
    expect(nqUpdatedPara).toBe(jqUpdatedPara);
    expect(nqUpdatedPara).toBe('<span>Updated</span> content');
  });

  test('should support complex chaining patterns - jquery-comparison', () => {
    const complexHtml = `
      <div class="app">
        <div class="header">
          <h1 class="title">App Title</h1>
          <nav class="menu">
            <ul>
              <li class="item active" data-id="1">Home</li>
              <li class="item" data-id="2">About</li>
              <li class="item" data-id="3">Contact</li>
            </ul>
          </nav>
        </div>
        <div class="content">
          <article class="post" data-category="news">
            <h2>News Article</h2>
            <p>Content here</p>
          </article>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(complexHtml);

    // Complex chaining: find().find().attr().text()
    const nqActiveItem = nqRoot.find('.menu').find('.active');
    const jqActiveItem = jqRoot.find('.menu').find('.active');

    const nqActiveText = nqActiveItem.text();
    const jqActiveText = jqActiveItem.text();
    expect(nqActiveText).toBe(jqActiveText);
    expect(nqActiveText).toBe('Home');

    const nqActiveId = nqActiveItem.attr('data-id');
    const jqActiveId = jqActiveItem.attr('data-id');
    expect(nqActiveId).toBe(jqActiveId);
    expect(nqActiveId).toBe('1');

    // Chain find() with multiple operations
    const nqPost = nqRoot.find('.content').find('.post');
    const jqPost = jqRoot.find('.content').find('.post');

    nqPost.attr('data-read', 'true');
    jqPost.attr('data-read', 'true');

    const nqReadStatus = nqPost.attr('data-read');
    const jqReadStatus = jqPost.attr('data-read');
    expect(nqReadStatus).toBe(jqReadStatus);
    expect(nqReadStatus).toBe('true');

    const nqCategory = nqPost.attr('data-category');
    const jqCategory = jqPost.attr('data-category');
    expect(nqCategory).toBe(jqCategory);
    expect(nqCategory).toBe('news');
  });

  test('should support chaining with multiple find() calls - jquery-comparison', () => {
    const nestedHtml = `
      <div class="level1">
        <div class="level2">
          <div class="level3">
            <div class="level4">
              <span class="target">Target Element</span>
            </div>
          </div>
        </div>
        <div class="sibling">
          <span class="other">Other Element</span>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(nestedHtml);

    // Multiple chained find() calls
    const nqTarget = nqRoot.find('.level1').find('.level2').find('.level3').find('.level4').find('.target');
    const jqTarget = jqRoot.find('.level1').find('.level2').find('.level3').find('.level4').find('.target');

    const nqTargetText = nqTarget.text();
    const jqTargetText = jqTarget.text();
    expect(nqTargetText).toBe(jqTargetText);
    expect(nqTargetText).toBe('Target Element');

    // Verify collections have same length
    expect(nqTarget.nodes.length).toBe(1);
    expect(jqTarget.length).toBe(1);

    // Chain with operations
    nqTarget.attr('data-found', 'yes');
    jqTarget.attr('data-found', 'yes');

    const nqFound = nqTarget.attr('data-found');
    const jqFound = jqTarget.attr('data-found');
    expect(nqFound).toBe(jqFound);
    expect(nqFound).toBe('yes');
  });

  test('should support chaining with mixed operations - jquery-comparison', () => {
    const mixedHtml = `
      <div class="panel">
        <h3 class="heading">Panel Title</h3>
        <div class="body">
          <p class="text">Some text content</p>
          <button class="btn" data-action="save">Save</button>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(mixedHtml);

    // Mixed chaining: find() -> attr() -> text() -> find() -> attr()
    const nqHeading = nqRoot.find('.heading');
    const jqHeading = jqRoot.find('.heading');

    nqHeading.attr('id', 'main-heading');
    jqHeading.attr('id', 'main-heading');

    const nqHeadingId = nqHeading.attr('id');
    const jqHeadingId = jqHeading.attr('id');
    expect(nqHeadingId).toBe(jqHeadingId);
    expect(nqHeadingId).toBe('main-heading');

    const nqHeadingText = nqHeading.text();
    const jqHeadingText = jqHeading.text();
    expect(nqHeadingText).toBe(jqHeadingText);
    expect(nqHeadingText).toBe('Panel Title');

    // Continue chaining from parent
    const nqButton = nqRoot.find('.body').find('.btn');
    const jqButton = jqRoot.find('.body').find('.btn');

    nqButton.attr('data-state', 'enabled');
    jqButton.attr('data-state', 'enabled');

    const nqButtonAction = nqButton.attr('data-action');
    const jqButtonAction = jqButton.attr('data-action');
    expect(nqButtonAction).toBe(jqButtonAction);
    expect(nqButtonAction).toBe('save');

    const nqButtonState = nqButton.attr('data-state');
    const jqButtonState = jqButton.attr('data-state');
    expect(nqButtonState).toBe(jqButtonState);
    expect(nqButtonState).toBe('enabled');
  });

  test('should handle chaining with empty results gracefully - jquery-comparison', () => {
    const emptyHtml = `
      <div class="container">
        <div class="existing">Exists</div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(emptyHtml);

    // Chain with non-existent elements
    const nqNonExistent = nqRoot.find('.non-existent');
    const jqNonExistent = jqRoot.find('.non-existent');

    // Operations on empty collections should not throw
    expect(() => {
      nqNonExistent.attr('data-test', 'value');
    }).not.toThrow();

    expect(() => {
      jqNonExistent.attr('data-test', 'value');
    }).not.toThrow();

    // Should return undefined for getters on empty collections
    const nqAttrResult = nqNonExistent.attr('any-attr');
    const jqAttrResult = jqNonExistent.attr('any-attr');
    expect(nqAttrResult).toBe(jqAttrResult);
    expect(nqAttrResult).toBeUndefined();

    // Text operations on empty collections
    const nqTextResult = nqNonExistent.text();
    const jqTextResult = jqNonExistent.text();
    expect(nqTextResult).toBe(jqTextResult);
    expect(nqTextResult).toBe('');
  });

  test('should support jQuery-style fluent interface patterns - jquery-comparison', () => {
    const fluentHtml = `
      <div class="card">
        <img class="image" src="pic.jpg" alt="Card image"/>
        <div class="content">
          <h4 class="title">Card Title</h4>
          <p class="description">Card description</p>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(fluentHtml);

    // jQuery-style fluent chaining
    const nqCard = nqRoot.find('.card');
    const jqCard = jqRoot.find('.card');

    // Chain multiple attribute operations
    nqCard.find('.image').attr('data-loaded', 'true').attr('title', 'Loaded image');
    jqCard.find('.image').attr('data-loaded', 'true').attr('title', 'Loaded image');

    const nqImage = nqCard.find('.image');
    const jqImage = jqCard.find('.image');

    const nqLoaded = nqImage.attr('data-loaded');
    const jqLoaded = jqImage.attr('data-loaded');
    expect(nqLoaded).toBe(jqLoaded);
    expect(nqLoaded).toBe('true');

    const nqTitle = nqImage.attr('title');
    const jqTitle = jqImage.attr('title');
    expect(nqTitle).toBe(jqTitle);
    expect(nqTitle).toBe('Loaded image');

    // Chain text operations
    nqCard.find('.title').text('Updated Card Title');
    jqCard.find('.title').text('Updated Card Title');

    const nqCardTitle = nqCard.find('.title').text();
    const jqCardTitle = jqCard.find('.title').text();
    expect(nqCardTitle).toBe(jqCardTitle);
    expect(nqCardTitle).toBe('Updated Card Title');
  });

  test('should support complex jQuery method chaining patterns - jquery-comparison', () => {
    const complexChainHtml = `
      <div class="dashboard">
        <div class="sidebar">
          <ul class="nav">
            <li class="nav-item active" data-section="home">
              <a href="#home">Home</a>
            </li>
            <li class="nav-item" data-section="profile">
              <a href="#profile">Profile</a>
            </li>
          </ul>
        </div>
        <div class="main">
          <div class="section" id="home">
            <h2>Home Section</h2>
            <p>Welcome to the home section</p>
          </div>
          <div class="section" id="profile">
            <h2>Profile Section</h2>
            <p>User profile information</p>
          </div>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(complexChainHtml);

    // Complex chaining with multiple selectors and operations
    const nqActiveNav = nqRoot.find('.nav').find('.active');
    const jqActiveNav = jqRoot.find('.nav').find('.active');

    const nqSectionName = nqActiveNav.attr('data-section');
    const jqSectionName = jqActiveNav.attr('data-section');
    expect(nqSectionName).toBe(jqSectionName);
    expect(nqSectionName).toBe('home');

    // Chain to find corresponding section
    const nqHomeSection = nqRoot.find('#home');
    const jqHomeSection = jqRoot.find('#home');

    nqHomeSection.attr('data-visible', 'true');
    jqHomeSection.attr('data-visible', 'true');

    const nqVisible = nqHomeSection.attr('data-visible');
    const jqVisible = jqHomeSection.attr('data-visible');
    expect(nqVisible).toBe(jqVisible);
    expect(nqVisible).toBe('true');

    // Chain text operations
    const nqHomeTitle = nqHomeSection.find('h2');
    const jqHomeTitle = jqHomeSection.find('h2');

    nqHomeTitle.text('Welcome Home');
    jqHomeTitle.text('Welcome Home');

    const nqTitleText = nqHomeTitle.text();
    const jqTitleText = jqHomeTitle.text();
    expect(nqTitleText).toBe(jqTitleText);
    expect(nqTitleText).toBe('Welcome Home');
  });

  test('should handle jQuery-style chained selections and manipulations - jquery-comparison', () => {
    const selectionHtml = `
      <div class="gallery">
        <div class="item" data-id="1">
          <img src="img1.jpg" alt="Image 1"/>
          <div class="caption">Caption 1</div>
        </div>
        <div class="item" data-id="2">
          <img src="img2.jpg" alt="Image 2"/>
          <div class="caption">Caption 2</div>
        </div>
        <div class="item featured" data-id="3">
          <img src="img3.jpg" alt="Image 3"/>
          <div class="caption">Featured Caption</div>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(selectionHtml);

    // Chain selections and manipulations
    const nqItems = nqRoot.find('.item');
    const jqItems = jqRoot.find('.item');

    // Chain find() within collection
    const nqCaptions = nqItems.find('.caption');
    const jqCaptions = jqItems.find('.caption');

    // Both should find 3 captions
    expect(nqCaptions.nodes.length).toBe(3);
    expect(jqCaptions.length).toBe(3);

    // Chain text updates
    nqCaptions.text('Updated caption');
    jqCaptions.text('Updated caption');

    // Verify all captions were updated
    nqCaptions.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqCaptions.eq(index);
      expect(nqElement.text()).toBe('Updated caption');
      expect(jqElement.text()).toBe('Updated caption');
    });

    // Chain attribute operations on specific items
    const nqFeatured = nqRoot.find('.featured');
    const jqFeatured = jqRoot.find('.featured');

    nqFeatured.attr('data-featured', 'true');
    jqFeatured.attr('data-featured', 'true');

    const nqFeaturedFlag = nqFeatured.attr('data-featured');
    const jqFeaturedFlag = jqFeatured.attr('data-featured');
    expect(nqFeaturedFlag).toBe(jqFeaturedFlag);
    expect(nqFeaturedFlag).toBe('true');
  });

  test('should support jQuery-style DOM manipulation chaining - jquery-comparison', () => {
    const manipulationHtml = `
      <div class="editor">
        <div class="toolbar">
          <button class="btn bold" data-command="bold">B</button>
          <button class="btn italic" data-command="italic">I</button>
        </div>
        <div class="content" contenteditable="true">
          <p>Initial content</p>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(manipulationHtml);

    // Chain DOM manipulations
    const nqContent = nqRoot.find('.content');
    const jqContent = jqRoot.find('.content');

    nqContent.attr('data-editing', 'true');
    jqContent.attr('data-editing', 'true');

    const nqEditing = nqContent.attr('data-editing');
    const jqEditing = jqContent.attr('data-editing');
    expect(nqEditing).toBe(jqEditing);
    expect(nqEditing).toBe('true');

    // Chain find() and text() operations
    const nqPara = nqContent.find('p');
    const jqPara = jqContent.find('p');

    nqPara.text('Edited content');
    jqPara.text('Edited content');

    const nqParaText = nqPara.text();
    const jqParaText = jqPara.text();
    expect(nqParaText).toBe(jqParaText);
    expect(nqParaText).toBe('Edited content');

    // Chain button operations
    const nqButtons = nqRoot.find('.btn');
    const jqButtons = jqRoot.find('.btn');

    nqButtons.attr('data-active', 'false');
    jqButtons.attr('data-active', 'false');

    nqButtons.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqButtons.eq(index);
      expect(nqElement.attr('data-active')).toBe('false');
      expect(jqElement.attr('data-active')).toBe('false');
    });
  });

  test('should handle jQuery-style event-like attribute chaining - jquery-comparison', () => {
    const eventHtml = `
      <div class="form-container">
        <form class="contact-form">
          <input type="text" class="field name" name="name" placeholder="Name"/>
          <input type="email" class="field email" name="email" placeholder="Email"/>
          <textarea class="field message" name="message" placeholder="Message"></textarea>
          <button type="submit" class="submit-btn">Send</button>
        </form>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(eventHtml);

    // Chain attribute operations like event handling setup
    const nqForm = nqRoot.find('.contact-form');
    const jqForm = jqRoot.find('.contact-form');

    nqForm.attr('data-validation', 'enabled');
    jqForm.attr('data-validation', 'enabled');

    const nqValidation = nqForm.attr('data-validation');
    const jqValidation = jqForm.attr('data-validation');
    expect(nqValidation).toBe(jqValidation);
    expect(nqValidation).toBe('enabled');

    // Chain field operations
    const nqFields = nqForm.find('.field');
    const jqFields = jqForm.find('.field');

    nqFields.attr('data-touched', 'false');
    jqFields.attr('data-touched', 'false');

    nqFields.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqFields.eq(index);
      expect(nqElement.attr('data-touched')).toBe('false');
      expect(jqElement.attr('data-touched')).toBe('false');
    });

    // Chain button state
    const nqButton = nqForm.find('.submit-btn');
    const jqButton = jqForm.find('.submit-btn');

    nqButton.attr('data-loading', 'false');
    jqButton.attr('data-loading', 'false');

    const nqLoading = nqButton.attr('data-loading');
    const jqLoading = jqButton.attr('data-loading');
    expect(nqLoading).toBe(jqLoading);
    expect(nqLoading).toBe('false');
  });

  test('should support jQuery-style chained selections with filtering - identical behavior', () => {
    const filteringHtml = `
      <div class="product-list">
        <div class="product available" data-price="10">
          <h3>Product A</h3>
          <span class="price">$10</span>
        </div>
        <div class="product out-of-stock" data-price="20">
          <h3>Product B</h3>
          <span class="price">$20</span>
        </div>
        <div class="product available featured" data-price="30">
          <h3>Product C</h3>
          <span class="price">$30</span>
        </div>
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(filteringHtml);

    // Chain selections with filtering - identical operations
    const nqProducts = nqRoot.find('.product');
    const jqProducts = jqRoot.find('.product');

    // Find available products - identical filtering
    const nqAvailable = nqProducts.filter('.available');
    const jqAvailable = jqProducts.filter('.available');

    expect(nqAvailable.nodes.length).toBe(jqAvailable.length);
    expect(nqAvailable.nodes.length).toBe(2);

    // Chain operations on filtered results - identical attribute setting
    nqAvailable.attr('data-status', 'available');
    jqAvailable.attr('data-status', 'available');

    // Verify identical attribute setting results
    nqAvailable.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqAvailable.eq(index);
      expect(nqElement.attr('data-status')).toBe(jqElement.attr('data-status'));
      expect(nqElement.attr('data-status')).toBe('available');
    });

    // Chain find() within filtered results - identical operations
    const nqPrices = nqAvailable.find('.price');
    const jqPrices = jqAvailable.find('.price');

    nqPrices.attr('data-currency', 'USD');
    jqPrices.attr('data-currency', 'USD');

    expect(nqPrices.nodes.length).toBe(jqPrices.length);
    expect(nqPrices.nodes.length).toBe(2);

    // Verify identical results
    nqPrices.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqPrices.eq(index);
      expect(nqElement.attr('data-currency')).toBe(jqElement.attr('data-currency'));
      expect(nqElement.attr('data-currency')).toBe('USD');
    });
  });

  test('should support complex jQuery method chaining patterns from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(complexHtml);

    // Complex chaining: find -> find -> attr/text operations - identical operations
    const nqActiveLink = nqRoot.find('.item.active').find('.link');
    const jqActiveLink = jqRoot.find('.item.active').find('.link');

    const nqActiveText = nqActiveLink.text();
    const jqActiveText = jqActiveLink.text();
    expect(nqActiveText).toBe(jqActiveText);
    expect(nqActiveText).toBe('Home');

    const nqActiveHref = nqActiveLink.attr('href');
    const jqActiveHref = jqActiveLink.attr('href');
    expect(nqActiveHref).toBe(jqActiveHref);
    expect(nqActiveHref).toBe('#home');

    // Chain find() with multiple operations - identical operations
    const nqPostTitle = nqRoot.find('.post').find('.post-title');
    const jqPostTitle = jqRoot.find('.post').find('.post-title');

    nqPostTitle.text('Updated Post Title');
    jqPostTitle.text('Updated Post Title');

    const nqUpdatedTitle = nqPostTitle.text();
    const jqUpdatedTitle = jqPostTitle.text();
    expect(nqUpdatedTitle).toBe(jqUpdatedTitle);
    expect(nqUpdatedTitle).toBe('Updated Post Title');

    const nqPostContent = nqRoot.find('.post').find('.post-content');
    const jqPostContent = jqRoot.find('.post').find('.post-content');

    nqPostContent.attr('data-length', '12');
    jqPostContent.attr('data-length', '12');

    const nqLength = nqPostContent.attr('data-length');
    const jqLength = jqPostContent.attr('data-length');
    expect(nqLength).toBe(jqLength);
    expect(nqLength).toBe('12');
  });

  test('should support chaining with multiple find() calls from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(multiFindHtml);

    // Chain multiple find() calls - identical operations
    const nqAllTitles = nqRoot.find('.section').find('.card').find('.card-title');
    const jqAllTitles = jqRoot.find('.section').find('.card').find('.card-title');

    expect(nqAllTitles.nodes.length).toBe(jqAllTitles.length);
    expect(nqAllTitles.nodes.length).toBe(3);

    const nqFeaturedCardTitle = nqRoot.find('.section').find('.card.featured').find('.card-title');
    const jqFeaturedCardTitle = jqRoot.find('.section').find('.card.featured').find('.card-title');

    expect(nqFeaturedCardTitle.nodes.length).toBe(jqFeaturedCardTitle.length);
    expect(nqFeaturedCardTitle.nodes.length).toBe(1);

    const nqFeaturedText = nqFeaturedCardTitle.text();
    const jqFeaturedText = jqFeaturedCardTitle.text();
    expect(nqFeaturedText).toBe(jqFeaturedText);
    expect(nqFeaturedText).toBe('Card 3');

    // Update through chaining - identical operations
    nqRoot.find('.section').find('.card').find('.card-title').text('Updated Card');
    jqRoot.find('.section').find('.card').find('.card-title').text('Updated Card');

    const nqUpdatedTitles = nqRoot.find('.card-title');
    const jqUpdatedTitles = jqRoot.find('.card-title');

    // Verify all titles were updated identically
    nqUpdatedTitles.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqUpdatedTitles.eq(index);
      expect(nqElement.text()).toBe(jqElement.text());
      expect(nqElement.text()).toBe('Updated Card');
    });
  });

  test('should support chaining with mixed operations from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(mixedHtml);

    // Mix find(), attr(), and text() operations - identical operations
    const nqNameInput = nqRoot.find('#input1');
    const jqNameInput = jqRoot.find('#input1');

    nqNameInput.attr('placeholder', 'Enter your name');
    jqNameInput.attr('placeholder', 'Enter your name');

    const nqPlaceholder = nqNameInput.attr('placeholder');
    const jqPlaceholder = jqNameInput.attr('placeholder');
    expect(nqPlaceholder).toBe(jqPlaceholder);
    expect(nqPlaceholder).toBe('Enter your name');

    const nqEmailInput = nqRoot.find('#input2');
    const jqEmailInput = jqRoot.find('#input2');

    nqEmailInput.attr('required', true);
    jqEmailInput.attr('required', true);

    const nqRequired = nqEmailInput.attr('required');
    const jqRequired = jqEmailInput.attr('required');
    expect(nqRequired).toBe(jqRequired);
    expect(nqRequired).toBe('required');

    const nqSubmitBtn = nqRoot.find('.submit');
    const jqSubmitBtn = jqRoot.find('.submit');

    nqSubmitBtn.text('Send Form');
    jqSubmitBtn.text('Send Form');

    nqSubmitBtn.attr('data-action', 'submit-form');
    jqSubmitBtn.attr('data-action', 'submit-form');

    const nqBtnText = nqSubmitBtn.text();
    const jqBtnText = jqSubmitBtn.text();
    expect(nqBtnText).toBe(jqBtnText);
    expect(nqBtnText).toBe('Send Form');

    const nqBtnAction = nqSubmitBtn.attr('data-action');
    const jqBtnAction = jqSubmitBtn.attr('data-action');
    expect(nqBtnAction).toBe(jqBtnAction);
    expect(nqBtnAction).toBe('submit-form');
  });

  test('should handle jQuery-style chained selections and manipulations from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(chainedHtml);

    // Chain form manipulations - identical operations
    const nqForm = nqRoot.filter('.contact-form');
    const jqForm = jqRoot.filter('.contact-form');

    // Set multiple input attributes in chain - identical operations
    nqForm.find('#name').attr('placeholder', 'Enter your name').attr('data-required', 'true');
    jqForm.find('#name').attr('placeholder', 'Enter your name').attr('data-required', 'true');

    nqForm.find('#email').attr('placeholder', 'Enter your email').attr('data-required', 'true');
    jqForm.find('#email').attr('placeholder', 'Enter your email').attr('data-required', 'true');

    nqForm.find('#message').attr('placeholder', 'Enter your message').attr('rows', '5');
    jqForm.find('#message').attr('placeholder', 'Enter your message').attr('rows', '5');

    // Verify chained attribute setting - identical results
    const nqNameInput = nqForm.find('#name');
    const jqNameInput = jqForm.find('#name');
    expect(nqNameInput.attr('placeholder')).toBe(jqNameInput.attr('placeholder'));
    expect(nqNameInput.attr('data-required')).toBe(jqNameInput.attr('data-required'));

    const nqEmailInput = nqForm.find('#email');
    const jqEmailInput = jqForm.find('#email');
    expect(nqEmailInput.attr('placeholder')).toBe(jqEmailInput.attr('placeholder'));
    expect(nqEmailInput.attr('data-required')).toBe(jqEmailInput.attr('data-required'));

    const nqMessageTextarea = nqForm.find('#message');
    const jqMessageTextarea = jqForm.find('#message');
    expect(nqMessageTextarea.attr('rows')).toBe(jqMessageTextarea.attr('rows'));

    // Chain button manipulation - identical operations
    const nqSubmitBtn = nqForm.find('.btn-primary');
    const jqSubmitBtn = jqForm.find('.btn-primary');

    nqSubmitBtn.attr('data-loading-text', 'Submitting...').text('Submit Form');
    jqSubmitBtn.attr('data-loading-text', 'Submitting...').text('Submit Form');

    expect(nqSubmitBtn.attr('data-loading-text')).toBe(jqSubmitBtn.attr('data-loading-text'));
    expect(nqSubmitBtn.text()).toBe(jqSubmitBtn.text());
  });

  test('should support jQuery-style DOM manipulation chaining from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(manipHtml);

    // jQuery-style DOM manipulation chaining - identical operations
    const nqWidget = nqRoot.find('.widget');
    const jqWidget = jqRoot.find('.widget');

    const nqHeader = nqWidget.find('.widget-header');
    const jqHeader = jqWidget.find('.widget-header');

    const nqTitle = nqHeader.find('.widget-title');
    const jqTitle = jqHeader.find('.widget-title');

    const nqControls = nqHeader.find('.widget-controls');
    const jqControls = jqHeader.find('.widget-controls');

    // Chain attribute and content operations - identical operations
    nqTitle.attr('data-original-title', nqTitle.text()).text('Updated Widget Title');
    jqTitle.attr('data-original-title', jqTitle.text()).text('Updated Widget Title');

    nqControls.find('.btn-minimize').attr('title', 'Minimize widget').attr('aria-label', 'Minimize');
    jqControls.find('.btn-minimize').attr('title', 'Minimize widget').attr('aria-label', 'Minimize');

    nqControls.find('.btn-close').attr('title', 'Close widget').attr('aria-label', 'Close');
    jqControls.find('.btn-close').attr('title', 'Close widget').attr('aria-label', 'Close');

    // Chain body content update - identical operations
    nqWidget.find('.widget-content').text('Updated widget content with more information.');
    jqWidget.find('.widget-content').text('Updated widget content with more information.');

    // Verify all chained operations - identical results
    expect(nqTitle.attr('data-original-title')).toBe(jqTitle.attr('data-original-title'));
    expect(nqTitle.text()).toBe(jqTitle.text());

    const nqMinimizeBtn = nqControls.find('.btn-minimize');
    const jqMinimizeBtn = jqControls.find('.btn-minimize');
    expect(nqMinimizeBtn.attr('title')).toBe(jqMinimizeBtn.attr('title'));
    expect(nqMinimizeBtn.attr('aria-label')).toBe(jqMinimizeBtn.attr('aria-label'));

    const nqCloseBtn = nqControls.find('.btn-close');
    const jqCloseBtn = jqControls.find('.btn-close');
    expect(nqCloseBtn.attr('title')).toBe(jqCloseBtn.attr('title'));
    expect(nqCloseBtn.attr('aria-label')).toBe(jqCloseBtn.attr('aria-label'));

    const nqWidgetContent = nqWidget.find('.widget-content');
    const jqWidgetContent = jqWidget.find('.widget-content');
    expect(nqWidgetContent.text()).toBe(jqWidgetContent.text());
  });

  test('should handle jQuery-style event-like attribute chaining from original test - identical behavior', () => {
    const eventHtml = `
      <div class="interactive">
        <button class="action-btn" id="save-btn">Save</button>
        <button class="action-btn" id="cancel-btn">Cancel</button>
        <a href="#" class="link" id="help-link">Help</a>
        <input type="checkbox" class="toggle" id="auto-save">
      </div>
    `;

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(eventHtml);

    // Simulate jQuery event attribute chaining - identical operations
    const nqSaveBtn = nqRoot.find('#save-btn');
    const jqSaveBtn = jqRoot.find('#save-btn');

    const nqCancelBtn = nqRoot.find('#cancel-btn');
    const jqCancelBtn = jqRoot.find('#cancel-btn');

    const nqHelpLink = nqRoot.find('#help-link');
    const jqHelpLink = jqRoot.find('#help-link');

    const nqAutoSave = nqRoot.find('#auto-save');
    const jqAutoSave = jqRoot.find('#auto-save');

    // Chain event-related attributes - identical operations
    nqSaveBtn.attr('data-action', 'save').attr('data-confirm', 'Are you sure?').attr('aria-pressed', 'false');
    jqSaveBtn.attr('data-action', 'save').attr('data-confirm', 'Are you sure?').attr('aria-pressed', 'false');

    nqCancelBtn.attr('data-action', 'cancel').attr('data-dismiss', 'true').attr('aria-label', 'Cancel operation');
    jqCancelBtn.attr('data-action', 'cancel').attr('data-dismiss', 'true').attr('aria-label', 'Cancel operation');

    nqHelpLink.attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('aria-describedby', 'help-tooltip');
    jqHelpLink.attr('data-toggle', 'tooltip').attr('data-placement', 'top').attr('aria-describedby', 'help-tooltip');

    nqAutoSave.attr('data-toggle', 'autosave').attr('aria-checked', 'false');
    jqAutoSave.attr('data-toggle', 'autosave').attr('aria-checked', 'false');

    // Verify chained event attributes - identical results
    expect(nqSaveBtn.attr('data-action')).toBe(jqSaveBtn.attr('data-action'));
    expect(nqSaveBtn.attr('data-confirm')).toBe(jqSaveBtn.attr('data-confirm'));
    expect(nqSaveBtn.attr('aria-pressed')).toBe(jqSaveBtn.attr('aria-pressed'));

    expect(nqCancelBtn.attr('data-action')).toBe(jqCancelBtn.attr('data-action'));
    expect(nqCancelBtn.attr('data-dismiss')).toBe(jqCancelBtn.attr('data-dismiss'));
    expect(nqCancelBtn.attr('aria-label')).toBe(jqCancelBtn.attr('aria-label'));

    expect(nqHelpLink.attr('data-toggle')).toBe(jqHelpLink.attr('data-toggle'));
    expect(nqHelpLink.attr('data-placement')).toBe(jqHelpLink.attr('data-placement'));
    expect(nqHelpLink.attr('aria-describedby')).toBe(jqHelpLink.attr('aria-describedby'));

    expect(nqAutoSave.attr('data-toggle')).toBe(jqAutoSave.attr('data-toggle'));
    expect(nqAutoSave.attr('aria-checked')).toBe(jqAutoSave.attr('aria-checked'));
  });

  test('should support jQuery-style chained selections with filtering from original test - identical behavior', () => {
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

    const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(filterHtml);

    // Chain selections with filtering operations - identical operations
    const nqAllProducts = nqRoot.find('.product-item');
    const jqAllProducts = jqRoot.find('.product-item');

    expect(nqAllProducts.nodes.length).toBe(jqAllProducts.length);
    expect(nqAllProducts.nodes.length).toBe(4);

    const nqFeaturedProducts = nqRoot.find('.product-item.featured');
    const jqFeaturedProducts = jqRoot.find('.product-item.featured');

    expect(nqFeaturedProducts.nodes.length).toBe(jqFeaturedProducts.length);
    expect(nqFeaturedProducts.nodes.length).toBe(2);

    // Work with supported selectors - identical operations
    const nqProductNames = nqRoot.find('.product-name');
    const jqProductNames = jqRoot.find('.product-name');

    expect(nqProductNames.nodes.length).toBe(jqProductNames.length);
    expect(nqProductNames.nodes.length).toBe(4);

    const nqProductPrices = nqRoot.find('.product-price');
    const jqProductPrices = jqRoot.find('.product-price');

    expect(nqProductPrices.nodes.length).toBe(jqProductPrices.length);
    expect(nqProductPrices.nodes.length).toBe(4);

    // Chain attribute operations on multiple elements - identical operations
    nqFeaturedProducts.find('.product-price').attr('data-discount', '10%');
    jqFeaturedProducts.find('.product-price').attr('data-discount', '10%');

    nqFeaturedProducts.find('.product-status').attr('data-priority', 'high');
    jqFeaturedProducts.find('.product-status').attr('data-priority', 'high');

    // Verify attribute chaining on filtered results - identical results
    const nqFeaturedPrices = nqFeaturedProducts.find('.product-price');
    const jqFeaturedPrices = jqFeaturedProducts.find('.product-price');

    expect(nqFeaturedPrices.nodes.length).toBe(jqFeaturedPrices.length);
    expect(nqFeaturedPrices.nodes.length).toBe(2);

    // Check that all featured prices got the discount attribute identically
    nqFeaturedPrices.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqFeaturedPrices.eq(index);
      expect(nqElement.attr('data-discount')).toBe(jqElement.attr('data-discount'));
      expect(nqElement.attr('data-discount')).toBe('10%');
    });

    const nqFeaturedStatuses = nqFeaturedProducts.find('.product-status');
    const jqFeaturedStatuses = jqFeaturedProducts.find('.product-status');

    expect(nqFeaturedStatuses.nodes.length).toBe(jqFeaturedStatuses.length);
    expect(nqFeaturedStatuses.nodes.length).toBe(2);

    // Check that all featured statuses got the priority attribute identically
    nqFeaturedStatuses.each((index, element) => {
      const nqElement = $(element);
      const jqElement = jqFeaturedStatuses.eq(index);
      expect(nqElement.attr('data-priority')).toBe(jqElement.attr('data-priority'));
      expect(nqElement.attr('data-priority')).toBe('high');
    });
  });
});
