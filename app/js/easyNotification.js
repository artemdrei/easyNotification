'use strict';

class EasyNotification {
    constructor() {
        this._config = {
            'autoHide': true,
            'autoHideDuration': this.DEFAULT_DELAY,
            'showProgressBar': true,
            'globalPosition': 'top-right',
            'showAnimation': 'slideInRight',
            'hideAnimation': 'fadeOutDown'
        };
        this._selectors();
        this._constants();
        this._createPlaceholder();
        this._elements();
    }

    _selectors() {
        this.WRAPPER = 'c-notification-wrapper';
        this.NOTIFICATION = 'c-notification';
        this.TITLE = 'c-notification__title';
        this.NOTIFICATION_CONTENT = 'c-notification__content';
        this.CLOSE = 'c-notification__close';
        this.PROGRESS_BAR = 'c-progressbar';
        this.ICON = 'c-notification__icon';
        this.ICON_ANIMATED = 'is-icon-animated';
    }

    _constants() {
        this.DEFAULT_DELAY = 10000;
        this.INFINITE_DELAY = 9999999999;
        this.SHOW_DEALY = 100;
        this.REMOVE_DELAY = 300;
    }

    // create placeholder to the end of the Body
    _createPlaceholder() {
        if (document.querySelector('.c-notification-wrapper')) return;
        let placeholder = document.createElement('div');

        document.querySelector('body').appendChild(placeholder);
        placeholder.classList.add('c-notification-wrapper');
        placeholder.setAttribute('data-position', `${this._config.globalPosition}`);
    }

    _elements() {
        this.placeholder = document.querySelector(`.${this.WRAPPER}`);
    }

    // base html template for notification
    _template() {
        return `
                <div class="c-notification__icon" role="presentation"></div>
                <div class="c-notification__body">
                    <div class="c-notification__title"></div>
                    <div class="c-notification__content"></div>
                    <button class="c-notification__close">
                        <div class="close-cross" role="presentation"></div>
                    </button>
                </div>
                <div class="c-progressbar" role="progressbar"></div>`
    }

    // insert notification to the DOM with setTimeout for auto removing
    _insertNotification() {
        let notification = document.createElement('div');

        notification.classList.add(this.NOTIFICATION);
        notification.innerHTML = this._template();
        this.placeholder.setAttribute('data-position', this._config.globalPosition); // TODO: why is this here
        this.placeholder.insertBefore(notification, this.placeholder.firstChild);

        let timeoutId = setTimeout( () => {
            this._removeOnAutoHide(timeoutId);
        }, this._config.autoHideDuration);

        this.placeholder.firstChild.setAttribute('data-id', timeoutId);
        this._progressBar(timeoutId);
    }

    // add the class for icons animation and showing the ripple
    _iconAnimation(notification) {
        let icon = notification.querySelector(`.${this.ICON}`);

        notification.addEventListener('animationend', () => {
            icon.classList.add(`${this.ICON_ANIMATED}`);
        })
    }

    _show(notification) {
        notification.classList.add(this._config.showAnimation);
        this._iconAnimation(notification);
    }

    _hide(notification) {
        notification.classList.remove(this._config.showAnimation);
        notification.classList.add(this._config.hideAnimation);
    }

    // helper - show something with delay
    _showWithDelay(notification, delay = this.SHOW_DEALY) {
        setTimeout( () => {
            this._show(notification);
        }, delay);
    }

    // helper - removing something with delay
    _removeWithDelay(notification, delay = this.REMOVE_DELAY) {
        setTimeout( () => {
            notification.remove();
        }, delay)
    }

    // remove on trigger the cross
    _removeOnTriggerClose(e) {
        if (e && e.target.classList.contains(`${this.CLOSE}`) || e.target.classList.contains(`close-cross`)) {
            let notification = e.target.closest(`.${this.NOTIFICATION}`);
            let timeoutId = +notification.getAttribute('data-id');

            this._hide(notification);
            this._removeWithDelay(notification, 400);
            clearTimeout(timeoutId);
        }
    }

    // remove notification if exist and autoHide is present
    _removeOnAutoHide(timeoutId) {
        if (timeoutId) {
            let notification = document.querySelector(`div[data-id="${timeoutId}"]`);
            if (!notification) return;
            notification.querySelector(`.${this.PROGRESS_BAR}`).addEventListener('animationend', () => {
                this._hide(notification);
                this._removeWithDelay(notification, 400);
                clearInterval(timeoutId);
            });
        }
    }

    // add progress bar duration. There is many events based on the progress bar using 'animationend'
    _progressBar(timeoutId) {
        let currentNotification = document.querySelector(`div[data-id="${timeoutId}"]`);
        let progressBar = currentNotification.querySelector(`.${this.PROGRESS_BAR}`);

        progressBar.style.animationDuration = this._config.autoHideDuration + 'ms';
        if (!this._config.showProgressBar) progressBar.style.visibility = 'hidden';
    }

    // all events for this class
    _events() {
        let notificationsWrapper = document.querySelector(`.${this.WRAPPER}`)
        let notifications = document.querySelectorAll(`.${this.NOTIFICATION}`);

        if (notifications) {
            notificationsWrapper.onclick = (e) => { this._removeOnTriggerClose(e) }
        }
    }

    // init base methods
    _init() {
        this._insertNotification();
        this._events();
    }

    // validate config before using, show the error message if something went wrong
    _validateConfig(customConfig, field, type) {
        if (typeof customConfig[field] === `${type}`) {
            this._config[field] = customConfig[field];
        } else if ((customConfig[field] && typeof customConfig[field] !== `${type}`)) {
            throw  field + ` should be ${type}`;
        }
    }

    // validate type, show the warning message if something went wrong
    _validateType(type) {
        if (type && typeof type === 'string') {
            return type.toLowerCase();
        } else if (!type) {
            console.log('Something went wrong with notification type!');
            return type = 'warning';
        }
    }

    // do not show progress bar if autoHide = false
    _hideProgressBarIfAutoHideFalse(customConfig) {
        if (customConfig.autoHide === false) {
            this._config.autoHideDuration = this.INFINITE_DELAY;
            this._config.showProgressBar = false;
        } else if (customConfig.autoHide === true && customConfig.showProgressBar === false){
            this._config.autoHideDuration = customConfig.autoHideDuration;
            this._config.showProgressBar = false;
        }
    }

    // public method - it accepts custom config
    configuration(customConfig) {
        if (!customConfig) return;

        this._validateConfig(customConfig, 'autoHide', 'boolean');
        this._validateConfig(customConfig, 'autoHideDuration', 'number');
        this._validateConfig(customConfig, 'globalPosition', 'string');
        this._validateConfig(customConfig, 'showProgressBar', 'boolean');
        this._validateConfig(customConfig, 'showAnimation', 'string');
        this._validateConfig(customConfig, 'hideAnimation', 'string');
        this._hideProgressBarIfAutoHideFalse(customConfig);
    }

    // public method - it accepts content: text / html, the type: 'success, error, warning, info
    // notify('Account was created', 'success');
    notify(content, type) {
        this._init();
        let notification = document.querySelector(`.${this.NOTIFICATION}:first-child`);
        let container = notification.querySelector(`.${this.NOTIFICATION_CONTENT}`);
        let title = notification.querySelector(`.${this.TITLE}`);

        type = this._validateType(type);
        notification.classList.add(`${this.NOTIFICATION}--${type}`);
        title.innerHTML = `${type}`;
        container.innerHTML = `${content}`;
        this._showWithDelay(notification);
    }
}