import $ from '../../../index';
import jQuery from 'jquery';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('attr() method - jQuery Comparison', () => {
    const html = `
      <div class="post" id="main">
        <h1 style="color:red">Hello</h1>
        <p data-info='some info'>World</p>
        <img src="image.jpg" alt='pic'/>
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
});
