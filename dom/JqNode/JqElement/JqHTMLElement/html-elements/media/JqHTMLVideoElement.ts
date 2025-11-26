/**
 * Represents an HTML <video> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLVideoElement extends JqElement {
    constructor() {
        super('element', 'video');
    }

    /**
     * The URL of the video resource
     */
    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
    }

    /**
     * Video width
     */
    get width(): number {
        const value = this.getAttribute('width');
        return value ? parseInt(value, 10) : 0;
    }

    set width(value: number) {
        this.setAttribute('width', value.toString());
    }

    /**
     * Video height
     */
    get height(): number {
        const value = this.getAttribute('height');
        return value ? parseInt(value, 10) : 0;
    }

    set height(value: number) {
        this.setAttribute('height', value.toString());
    }

    /**
     * Whether to start playing automatically
     */
    get autoplay(): boolean {
        return this.hasAttribute('autoplay');
    }

    set autoplay(value: boolean) {
        if (value) {
            this.setAttribute('autoplay', '');
        } else {
            this.removeAttribute('autoplay');
        }
    }

    /**
     * Whether to show the default playback controls
     */
    get controls(): boolean {
        return this.hasAttribute('controls');
    }

    set controls(value: boolean) {
        if (value) {
            this.setAttribute('controls', '');
        } else {
            this.removeAttribute('controls');
        }
    }

    /**
     * Whether to loop the video
     */
    get loop(): boolean {
        return this.hasAttribute('loop');
    }

    set loop(value: boolean) {
        if (value) {
            this.setAttribute('loop', '');
        } else {
            this.removeAttribute('loop');
        }
    }

    /**
     * Whether the video should be muted
     */
    get muted(): boolean {
        return this.hasAttribute('muted');
    }

    set muted(value: boolean) {
        if (value) {
            this.setAttribute('muted', '');
        } else {
            this.removeAttribute('muted');
        }
    }

    /**
     * URL of poster image
     */
    get poster(): string {
        return this.getAttribute('poster') || '';
    }

    set poster(value: string) {
        this.setAttribute('poster', value);
    }

    /**
     * Preload hint
     */
    get preload(): string {
        return this.getAttribute('preload') || '';
    }

    set preload(value: string) {
        this.setAttribute('preload', value);
    }

    /**
     * Whether to play inline on mobile
     */
    get playsInline(): boolean {
        return this.hasAttribute('playsinline');
    }

    set playsInline(value: boolean) {
        if (value) {
            this.setAttribute('playsinline', '');
        } else {
            this.removeAttribute('playsinline');
        }
    }

    /**
     * Cross-origin attribute
     */
    get crossOrigin(): string | null {
        return this.getAttribute('crossorigin');
    }

    set crossOrigin(value: string | null) {
        if (value === null) {
            this.removeAttribute('crossorigin');
        } else {
            this.setAttribute('crossorigin', value);
        }
    }
}
