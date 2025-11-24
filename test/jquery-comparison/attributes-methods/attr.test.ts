import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('attr() method - jQuery Comparison', () => {
    const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
        <input type="checkbox" id="chk1" checked="checked" />
        <input type="text" id="txt1" readonly />
        <button disabled>Click me</button>
      </div>
    `;

    test('attr() should get attribute values - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqP = nqRoot.find('p');
        const jqP = jqRoot.find('p');

        const nqDataInfo = nqP.attr('data-info');
        const jqDataInfo = jqP.attr('data-info');

        expect(nqDataInfo).toBe(jqDataInfo);
        expect(nqDataInfo).toBe('some info');

        const nqImg = nqRoot.find('img');
        const jqImg = jqRoot.find('img');

        expect(nqImg.attr('src')).toBe(jqImg.attr('src'));
        expect(nqImg.attr('alt')).toBe(jqImg.attr('alt'));
    });

    test('attr() should return undefined for non-existent attributes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqDiv = nqRoot.find('div');
        const jqDiv = jqRoot.find('div');

        const nqAttr = nqDiv.attr('non-existent');
        const jqAttr = jqDiv.attr('non-existent');

        expect(nqAttr).toBe(jqAttr);
        expect(nqAttr).toBeUndefined();
    });

    test('attr() should set attribute values - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqP = nqRoot.find('p');
        const jqP = jqRoot.find('p');

        nqP.attr('new-attr', 'new-value');
        jqP.attr('new-attr', 'new-value');

        const nqAttr = nqP.attr('new-attr');
        const jqAttr = jqP.attr('new-attr');

        expect(nqAttr).toBe(jqAttr);
        expect(nqAttr).toBe('new-value');
    });

    test('attr() should set multiple attributes via object - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqH1 = nqRoot.find('h1');
        const jqH1 = jqRoot.find('h1');

        const attrs = {
            title: 'Greeting',
            'data-test': '123',
            'aria-label': 'Header',
        };

        nqH1.attr(attrs);
        jqH1.attr(attrs);

        expect(nqH1.attr('title')).toBe(jqH1.attr('title'));
        expect(nqH1.attr('data-test')).toBe(jqH1.attr('data-test'));
        expect(nqH1.attr('aria-label')).toBe(jqH1.attr('aria-label'));
    });

    test('attr() should handle function argument - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqImg = nqRoot.find('img');
        const jqImg = jqRoot.find('img');

        nqImg.attr('alt', function (index: number, attr: string | undefined) {
            return (attr || '') + ' - modified';
        });
        jqImg.attr('alt', function (index: number, attr: string | undefined) {
            return (attr || '') + ' - modified';
        });

        expect(nqImg.attr('alt')).toBe(jqImg.attr('alt'));
        expect(nqImg.attr('alt')).toBe('pic - modified');
    });

    test('attr() should handle boolean attributes - jquery-comparison', () => {
        const { jquery: jqRoot, nodeQuery: nqRoot } = createTestDom(html);

        const nqChk = nqRoot.find('#chk1');
        const jqChk = jqRoot.find('#chk1');

        // Get boolean attribute
        expect(nqChk.attr('checked')).toBe(jqChk.attr('checked'));

        // Set boolean attribute to false (remove it)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nqChk.attr('checked', false as any); // Type cast if necessary until types are updated
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jqChk.attr('checked', false as any);

        expect(nqChk.attr('checked')).toBe(jqChk.attr('checked'));
        expect(nqChk.attr('checked')).toBeUndefined();

        // Set boolean attribute to true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nqChk.attr('disabled', true as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jqChk.attr('disabled', true as any);

        expect(nqChk.attr('disabled')).toBe(jqChk.attr('disabled'));
        expect(nqChk.attr('disabled')).toBe('disabled');
    });
});
