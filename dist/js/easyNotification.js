'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EasyNotification = function () {
    function EasyNotification() {
        _classCallCheck(this, EasyNotification);

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

    _createClass(EasyNotification, [{
        key: '_selectors',
        value: function _selectors() {
            this.WRAPPER = 'c-notification-wrapper';
            this.NOTIFICATION = 'c-notification';
            this.TITLE = 'c-notification__title';
            this.NOTIFICATION_CONTENT = 'c-notification__content';
            this.CLOSE = 'c-notification__close';
            this.PROGRESS_BAR = 'c-progressbar';
            this.ICON = 'c-notification__icon';
            this.ICON_ANIMATED = 'is-icon-animated';
        }
    }, {
        key: '_constants',
        value: function _constants() {
            this.DEFAULT_DELAY = 10000;
            this.INFINITE_DELAY = 9999999999;
            this.SHOW_DEALY = 100;
            this.REMOVE_DELAY = 300;
        }
    }, {
        key: '_createPlaceholder',
        value: function _createPlaceholder() {
            if (document.querySelector('.c-notification-wrapper')) return;
            var placeholder = document.createElement('div');

            document.querySelector('body').appendChild(placeholder);
            placeholder.classList.add('c-notification-wrapper');
            placeholder.setAttribute('data-position', '' + this._config.globalPosition);
        }
    }, {
        key: '_elements',
        value: function _elements() {
            this.placeholder = document.querySelector('.' + this.WRAPPER);
        }
    }, {
        key: '_template',
        value: function _template() {
            return '\n                <div class="c-notification__icon" role="presentation"></div>\n                <div class="c-notification__body">\n                    <div class="c-notification__title"></div>\n                    <div class="c-notification__content"></div>\n                    <button class="c-notification__close">\n                        <div class="close-cross" role="presentation"></div>\n                    </button>\n                </div>\n                <div class="c-progressbar" role="progressbar"></div>';
        }
    }, {
        key: '_insertNotification',
        value: function _insertNotification() {
            var _this = this;

            var notification = document.createElement('div');

            notification.classList.add(this.NOTIFICATION);
            notification.innerHTML = this._template();
            this.placeholder.setAttribute('data-position', this._config.globalPosition); // TODO: why is this here
            this.placeholder.insertBefore(notification, this.placeholder.firstChild);

            var timeoutId = setTimeout(function () {
                _this._removeOnAutoHide(timeoutId);
            }, this._config.autoHideDuration);

            this.placeholder.firstChild.setAttribute('data-id', timeoutId);
            this._progressBar(timeoutId);
        }
    }, {
        key: '_iconAnimation',
        value: function _iconAnimation(notification) {
            var _this2 = this;

            var icon = notification.querySelector('.' + this.ICON);

            notification.addEventListener('animationend', function () {
                icon.classList.add('' + _this2.ICON_ANIMATED);
            });
        }
    }, {
        key: '_show',
        value: function _show(notification) {
            notification.classList.add(this._config.showAnimation);
            this._iconAnimation(notification);
        }
    }, {
        key: '_hide',
        value: function _hide(notification) {
            console.log('hide');
            // TODO: try to fix not removing
            notification.classList.remove(this._config.showAnimation);
            notification.classList.add(this._config.hideAnimation);
        }
    }, {
        key: '_showWithDelay',
        value: function _showWithDelay(notification) {
            var _this3 = this;

            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.SHOW_DEALY;

            setTimeout(function () {
                _this3._show(notification);
            }, delay);
        }
    }, {
        key: '_removeWithDelay',
        value: function _removeWithDelay(notification) {
            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.REMOVE_DELAY;

            setTimeout(function () {
                notification.remove();
            }, delay);
        }

        // remove on trigger the cross

    }, {
        key: '_removeOnTriggerClose',
        value: function _removeOnTriggerClose(e) {
            if (e && e.target.classList.contains('' + this.CLOSE) || e.target.classList.contains('close-cross')) {
                var notification = e.target.closest('.' + this.NOTIFICATION);
                var timeoutId = +notification.getAttribute('data-id');

                this._hide(notification);
                this._removeWithDelay(notification, 400);
                clearTimeout(timeoutId);
            }
        }

        // remove notification if exist and autoHide is present

    }, {
        key: '_removeOnAutoHide',
        value: function _removeOnAutoHide(timeoutId) {
            var _this4 = this;

            if (timeoutId) {
                var notification = document.querySelector('div[data-id="' + timeoutId + '"]');
                if (!notification) return;
                notification.querySelector('.' + this.PROGRESS_BAR).addEventListener('animationend', function () {
                    _this4._hide(notification);
                    _this4._removeWithDelay(notification, 400);
                    clearInterval(timeoutId);
                });
            }
        }

        // add progress bar

    }, {
        key: '_progressBar',
        value: function _progressBar(timeoutId) {
            var currentNotification = document.querySelector('div[data-id="' + timeoutId + '"]');
            var progressBar = currentNotification.querySelector('.' + this.PROGRESS_BAR);

            progressBar.style.animationDuration = this._config.autoHideDuration + 'ms';
            if (!this._config.showProgressBar) progressBar.style.visibility = 'hidden';
        }
    }, {
        key: '_events',
        value: function _events() {
            var _this5 = this;

            var notificationsWrapper = document.querySelector('.' + this.WRAPPER);
            var notifications = document.querySelectorAll('.' + this.NOTIFICATION);

            if (notifications) {
                notificationsWrapper.onclick = function (e) {
                    _this5._removeOnTriggerClose(e);
                };
            }
        }
    }, {
        key: '_init',
        value: function _init() {
            this._insertNotification();
            this._events();
        }
    }, {
        key: '_validateConfig',
        value: function _validateConfig(customConfig, field, type) {
            if (typeof customConfig[field] === '' + type) {
                this._config[field] = customConfig[field];
            } else if (customConfig[field] && typeof customConfig[field] !== '' + type) {
                throw field + (' should be ' + type);
            }
        }

        // custom config

    }, {
        key: 'configuration',
        value: function configuration(customConfig) {
            if (!customConfig) return;

            this._validateConfig(customConfig, 'autoHide', 'boolean');
            this._validateConfig(customConfig, 'autoHideDuration', 'number');
            this._validateConfig(customConfig, 'globalPosition', 'string');
            this._validateConfig(customConfig, 'showProgressBar', 'boolean');
            this._validateConfig(customConfig, 'showAnimation', 'string');
            this._validateConfig(customConfig, 'hideAnimation', 'string');

            // TODO: should be changed with cleaner solution
            // not a correct delay if progressBar is false
            if (customConfig.autoHide === false) {
                this._config.autoHideDuration = this.INFINITE_DELAY;
                this._config.showProgressBar = false;
            } else if (customConfig.autoHide === true && customConfig.showProgressBar === false) {
                this._config.autoHideDuration = customConfig.autoHideDuration;
                this._config.showProgressBar = false;
            }
        }
    }, {
        key: 'notify',
        value: function notify(content, type) {
            this._init();
            var notification = document.querySelector('.' + this.NOTIFICATION + ':first-child');
            var container = notification.querySelector('.' + this.NOTIFICATION_CONTENT);
            var title = notification.querySelector('.' + this.TITLE);

            notification.classList.add(this.NOTIFICATION + '--' + type);
            title.innerHTML = '' + type;
            container.innerHTML = '' + content;
            this._showWithDelay(notification);
        }
    }]);

    return EasyNotification;
}();