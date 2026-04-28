/**
 * Represents an HTML <audio> element
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
 */

import { JqElement } from '../../../JqElement';

export class JqHTMLAudioElement extends JqElement {
    constructor() {
        super('element', 'audio');
    }

    /**
     * The URL of the audio resource
     */
    get src(): string {
        return this.getAttribute('src') || '';
    }

    set src(value: string) {
        this.setAttribute('src', value);
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
     * Whether to loop the audio
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
     * Whether the audio should be muted
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
     * Preload hint
     */
    get preload(): string {
        return this.getAttribute('preload') || '';
    }

    set preload(value: string) {
        this.setAttribute('preload', value);
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
