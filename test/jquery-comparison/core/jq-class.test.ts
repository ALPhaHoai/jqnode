import $ from '../../../index';
import { JQ } from '../../../index';
import { createTestDom } from '../../utils/jquery-comparison-helpers';

describe('JQ Class Features - jQuery Comparison', () => {
    test('pushStack should create new instance with prevObject set', () => {
        const html = '<div><span>1</span><span>2</span></div>';
        const { nodeQuery: nqRoot } = createTestDom(html);

        const spans = nqRoot.find('span');
        const pushed = nqRoot.pushStack(spans.nodes);

        expect(pushed).not.toBe(nqRoot);
        expect(pushed.length).toBe(2);
        expect(pushed._prevObject).toBe(nqRoot);

        // Test end()
        const ended = pushed.end();
        expect(ended).toBe(nqRoot);
    });

    test('sort should sort nodes in place', () => {
        const nq = $([{ type: 'text', textData: 'b' }, { type: 'text', textData: 'a' }] as any);

        nq.sort((a, b) => {
            return (a.textData || '').localeCompare(b.textData || '');
        });

        expect(nq[0]?.textData).toBe('a');
        expect(nq[1]?.textData).toBe('b');
    });

    test('splice should modify nodes in place', () => {
        const nq = $([{ type: 'text', textData: '1' }, { type: 'text', textData: '2' }, { type: 'text', textData: '3' }] as any);

        const removed = nq.splice(1, 1);

        expect(nq.length).toBe(2);
        expect(nq[0]?.textData).toBe('1');
        expect(nq[1]?.textData).toBe('3');
        expect(removed.length).toBe(1);
        expect(removed[0].textData).toBe('2');
    });

    test('length property should be settable', () => {
        const nq = $([{ type: 'text', textData: '1' }, { type: 'text', textData: '2' }] as any);

        expect(nq.length).toBe(2);

        nq.length = 1;
        expect(nq.length).toBe(1);
        expect(nq[1]).toBeUndefined();

        nq.length = 0;
        expect(nq.length).toBe(0);
        expect(nq[0]).toBeUndefined();
    });

    test('should allow setting elements via numeric indices', () => {
        const nq = $();
        expect(nq.length).toBe(0);

        nq[0] = { type: 'text', textData: 'test' } as any;
        expect(nq.length).toBe(1); // Note: Array length updates automatically when index is set beyond current length
        expect(nq[0]?.textData).toBe('test');
    });
});
