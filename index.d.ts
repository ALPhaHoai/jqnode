/**
 * Type definitions for jqnode module
 * This augments the auto-generated types to include static methods on the factory function
 */

import JQ from './jq';
import type { HtmlNode } from './types';

declare function JQFactory(htmlOrSelectorOrNodes: string | HtmlNode[] | HtmlNode | any, context?: HtmlNode[]): JQ;

declare namespace JQFactory {
    // Static properties and methods
    const fn: typeof JQ.prototype;
    const clearRootNodesRegistry: typeof JQ.clearRootNodesRegistry;

    // Utility methods
    function each(collection: any[] | Record<string, any>, callback: (indexOrKey: any, value: any) => any): any;
    function map(collection: any[] | Record<string, any>, callback: (value: any, indexOrKey: any) => any): any[];
    function load(html: string, options?: { normalize?: boolean }): any;

    // Static utility methods from utils-static
    function now(): number;
    function noop(): void;
    function param(obj: any): string;
    function parseHTML(html: string): HtmlNode[];
    function parseJSON(json: string): any;
    function parseXML(xml: string): any;
    function trim(str: string): string;
    function type(obj: any): string;
    function unique(array: any[]): any[];
    function uniqueSort(array: any[]): any[];
    function makeArray(arrayLike: any): any[];
    function isPlainObject(obj: any): boolean;
    function isNumeric(value: any): boolean;
    function isFunction(value: any): boolean;
    function isEmptyObject(obj: any): boolean;
    function isArray(value: any): boolean;
    function inArray(value: any, array: any[], fromIndex?: number): number;
    function hasData(element: any): boolean;
    function extend(...args: any[]): any;
    function escapeSelector(selector: string): string;
    function title(newTitle?: string): string;
    function normalizeHTML(html: string): string;
}

export = JQFactory;
