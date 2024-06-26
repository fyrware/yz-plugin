yz.actions = new YzActionService();
yz.ajax = new YzAjaxService();
yz.cookies = new YzCookieService();
yz.icons = new YzIconService();
yz.notifications = new YzNotificationService();
yz.templates = new YzTemplateService();

yz.ready = function ready() {
    const observable = new YzObservable();

    if (document.readyState === 'complete') {
        window.requestAnimationFrame(() => {
            observable.notify();
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observable.notify();
        });
    }

    return observable;
}

yz.nextFrame = function nextFrame() {
    const observable = new YzObservable();

    window.requestAnimationFrame(() => {
        observable.notify();
    });

    return observable;
}

Object.defineProperty(yz, 'address', {
    get() {
        return {
            host: window.location.host,
            port: window.location.port,
            href: window.location.href,
            path: window.location.pathname,
            origin: window.location.origin,
            protocol: window.location.protocol,
            query: new URLSearchParams(window.location.search),
            redirect(url) {
                window.location.href = url;
            }
        }
    }
})

// OLD SHIT BELOW: =========================================================



/**
 * @callback YzNodeListItem
 * @param { number } [index = 0]
 * @returns { Node | null }
 */

/**
 * @typedef { NodeList } YzNodeList
 * @property { YzNodeListItem } item
 */

// class YzObservable {
//
//     #observers = new Set();
//
//     observe(observer) {
//         this.#observers.add(observer);
//     }
//
//     cancel(observer) {
//         this.#observers.delete(observer);
//     }
//
//     notify(...args) {
//         this.#observers.forEach(observer => observer(...args));
//     }
// }

/** @deprecated */
class YzEventObservable extends YzObservable {

    /** @type { EventTarget | YzEventWatcher } */
    #target;

    /** @type { string } */
    #event;

    /**
     * @param { EventTarget | YzEventWatcher } target
     * @param { string } event
     */
    constructor(target, event) {
        super();

        this.#target = target;
        this.#event = event;

        if (this.#target.on) {
            this.#target.on(this.#event, (...args) => {
                this.notify(...args);
            });
        } else if (this.#target instanceof YzNodeReference) {
            this.#target.forEach((ref) => {
                ref.item().addEventListener(this.#event, (...args) => {
                    this.notify(...args);
                });
            });
        } else {
            this.#target.addEventListener(this.#event, (...args) => {
                this.notify(...args);
            });
        }
    }
}

/**
 * Runs `ParentNode#querySelectorAll` against a given context (default is document)
 * @param selector
 * @param context
 * @returns YzNodeList
 */
// function yz(selector, context = document) {
//     return Object.assign(context.querySelectorAll(selector), {
//         item(index = 0) {
//             return NodeList.prototype.item.call(this, index);
//         }
//     });
// }

/**
 * @typedef { object } YzIconLibrary
 * @property { object | undefined } thin
 * @property { object | undefined } light
 * @property { object | undefined } regular
 * @property { object | undefined } bold
 * @property { object | undefined } duotone
 * @property { object | undefined } solid
 */

/**
 * Library of available icons (must be loaded server-side)
 * @type YzIconLibrary
 */

/** @deprecated */
yz.wordpress = Object.seal({
    ajax: '',
    nonce: '',
});

/** @deprecated */
yz.dateLocale = 'en-US';

/**
 * @callback YzEventWatcherFn
 * @param { string } event
 * @param { function } callback
 */

/**
 * @typedef { object } YzEventWatcher
 * @property { YzEventWatcherFn } on
 * @property { YzEventWatcherFn } off
 */

/**
 * Attaches an observable to a given element and event
 * @param { EventTarget | YzEventWatcher } element
 * @param { string } event
 * @returns { YzEventObservable }
 */
/** @deprecated */
yz.spy = function spy(element, event) {
    return new YzEventObservable(element, event);
}

/** @deprecated */
yz.do = function doEvent(element, event) {
    return element.dispatchEvent(
        event instanceof Event ? event : new Event(event)
    );
}

/**
 * Attaches an observable to a fetch request
 * @param { string } action
 * @param { FormData | object } data
 * @returns { YzObservable }
 */
/** @deprecated */
yz.submit = function request(action, data = new FormData()) {
    const observable = new YzObservable();

    if (!(data instanceof FormData)) {
        const object = data;

        data = new FormData();

        Object.entries(object).forEach(([key, value]) => {
            data.append(key, value);
        });
    }

    const options = {
        method: 'post',
        credentials: 'same-origin',
        body: data
    };

    options.body.append('action', action);
    options.body.append('nonce', yz.wordpress.nonce);

    fetch(yz.wordpress.ajax, options).then(async response => {
        observable.notify(await response.json());
    });

    return observable;
}

/**
 * Attaches an observable to a fetch request with the `GET` method
 * @param { string } action
 * @param { object } params
 * @returns { YzObservable }
 */
/** @deprecated */
yz.query = function query(action, params = {}) {
    const observable = new YzObservable();

    const options = {
        method: 'get',
        credentials: 'same-origin',
    };

    const queryString = '?action=' + action + '&' + Object.entries(params).map(([key, value]) => {
        return `${key}=${encodeURIComponent(String(value))}`;
    }).join('&');

    fetch(yz.wordpress.ajax + queryString, options).then(async response => {
        observable.notify(await response.json());
    });

    return observable;
}

/**
 * @param { HTMLTemplateElement } template
 */
/** @deprecated */
yz.instance = function instance(template) {
    return document.importNode(template.content, true);
}

/**
 *
 * @param { Date | string | number } date
 * @param { DateTimeFormatOptions } options
 */
/** @deprecated */
yz.date = function date(date = Date.now(), options = {}) {
    return new Date(date).toLocaleDateString(yz.dateLocale, options);
}

/**
 * Debounce a function callback
 * @param { function(...[*]): void } fn
 * @param { number } delay
 * @returns { (function(...[*]): void) | * }
 */
/** @deprecated */
yz.debounce = function debounce(fn, delay = 250) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle a function callback
 * @param fn
 * @param delay
 * @returns {(function(...[*]): void)|*}
 */
/** @deprecated */
yz.throttle = function throttle(fn, delay = 250) {
    let timeout;

    return (...args) => {
        if (timeout) return;

        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, delay);
    };
}

/**
 * Check if a value is not undefined
 * @param value
 * @returns { boolean }
 */
/** @deprecated */
yz.defined = function defined(value) {
    return value !== undefined;
}

/**
 * Attach a media picker to a given element, triggered on `click`
 * @param element
 * @param options
 */
/** @deprecated */
yz.pickMedia = function pickMedia(element, options = {}) {
    const mediaFrame = wp.media(options);
    const observable = new YzObservable();

    yz.spy(mediaFrame, 'select').observe(() => {
        observable.notify(
            mediaFrame.state().get('selection').first().toJSON()
        );
    });

    yz.spy(element, 'click').observe((event) => {
        event.preventDefault();
        mediaFrame.open();
    });

    return observable;
}

/** @deprecated */
yz.ux = {
    /**
     * Make a list element reorderable, triggered on drag & drop
     * @param { HTMLUListElement | HTMLOListElement } list
     */
    enableReorder(list) {
        yz('li', list).forEach((item) => {
            item.draggable = true;
            item.dataset.state = 'idle';

            yz.spy(list, 'dragover').observe((dragover) => {
                dragover.preventDefault();
            });

            yz.spy(item, 'drag').observe((drag) => {
                const swapItem = document.elementFromPoint(event.clientX, event.clientY) ?? item;
                const actualSwapItem = swapItem.closest('li');

                drag.target.dataset.state = 'dragging';

                if (list.contains(actualSwapItem)) {
                    list.insertBefore(item, item.nextSibling !== actualSwapItem ? actualSwapItem : actualSwapItem.nextSibling);
                }
            });

            yz.spy(item, 'dragend').observe((dragend) => {
                dragend.target.dataset.state = 'idle';
            });
        });
    }
}
