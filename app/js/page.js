let notification = new EasyNotification();
let btnWrapper = document.querySelector('.btn-wrapper');
let textArea = document.querySelector('#message');
let configPresentation = document.querySelector('#configPresentation');
let previewJsConfig = configPresentation.querySelector('.config-preview');
let configWrapper = document.querySelector('.config');
let checkedType = 'random';
let config = {
    "autoHide": true,
    "showProgressBar": true,
    "globalPosition": "top-right",
    "autoHideDuration": 4000,
    "showAnimation": "slideInRight",
    "hideAnimation": "slideInLeft"
};
let text = [
    `No one is born hating another person because of the color of his skin or his background or his religion`,
    `broken.from the bottom of my heart, i am so so sorry. i don't have words`,
    `If only Bradley's arm was longer. Best photo ever.`,
    `John McCain is an American hero & one of the bravest fighters I've ever known. Cancer doesn't know what it's up agains`,
    `	Hi everybody! Back to the original handle. Is this thing still on? Michelle and I are off on a quick vacation, then we'll get back to work`,
    `Thank you for everything. My last ask is the same as my first. I'm asking you to believe—not in my ability to create change, but in yours`,
    `...For love comes more naturally to the human heart than its opposite.`,
    `	From the Obama family to yours, we wish you a Happy Thanksgiving full of joy and gratitude`,
    `Happy Birthday to my amazing wife`,
    `20 years ago today a world that I had lived in alone was suddenly open to others. It's been wonderful. Thank you.`
];
let typePreset =['success', 'error', 'warning', 'info'];

let previewConfig = (config) => {
    return previewJsConfig.innerHTML =`notification.configuration(${JSON.stringify(config, null, 2)});`;
};
previewConfig(config);

document.addEventListener('DOMContentLoaded', () => {
    let parent = document.querySelector('.config');

    parent.querySelector('.autoHide').checked = config.autoHide;
    parent.querySelector('.showProgressBar').checked = config.showProgressBar;
    parent.querySelector('.autoHideDuration').value = config.autoHideDuration;
    parent.querySelector('.showAnimation').value = config.showAnimation;
    parent.querySelector('.hideAnimation').value = config.hideAnimation;
    parent.querySelector('#configPresentation').classList.add('language-js');
}, false);

let changeAnimationOptionsCompareWithGlobalPosition = (e) => {
    let input = e.target;
    let selectShowAnimation = document.querySelector('.showAnimation');
    let selectHideAnimation = document.querySelector('.hideAnimation');
    let optionShowAnimation = document.createElement('option');
    let optionHideAnimation = document.createElement('option');

    if (input.dataset.globalPosition.match('left')) {
        optionShowAnimation.innerText = 'slideInLeft';
        selectShowAnimation.querySelector('option').remove();
        selectShowAnimation.insertAdjacentElement('afterbegin', optionShowAnimation);

        optionHideAnimation.innerText = 'slideInRight';
        selectHideAnimation.querySelector('option').remove();
        selectHideAnimation.insertAdjacentElement('afterbegin', optionHideAnimation);

        config.showAnimation = 'slideInLeft';
        config.hideAnimation = 'slideInRight';
    } else if (input.dataset.globalPosition.match('right')) {
        optionShowAnimation.innerText = 'slideInRight';
        selectShowAnimation.querySelector('option').remove();
        selectShowAnimation.insertAdjacentElement('afterbegin', optionShowAnimation);

        optionHideAnimation.innerText = 'slideInLeft';
        selectHideAnimation.querySelector('option').remove();
        selectHideAnimation.insertAdjacentElement('afterbegin', optionHideAnimation);

        config.showAnimation = 'slideInRight';
        config.hideAnimation = 'slideInLeft';
    }

    selectShowAnimation.querySelector('option').setAttribute('selected', 'selected')
    selectHideAnimation.querySelector('option').setAttribute('selected', 'selected')
};

let changeConfig = (e) => {
    let input = e.target;
    let type = input.getAttribute('type');
    let prop = input.getAttribute('class');
    let name = input.getAttribute('name');

    if (type === 'checkbox') {
        config[prop] = input.checked;
    } else if (type === 'number') {
        config[prop] = parseInt(input.value);
    } else if (type === 'text'){
        config[prop] = input.value;
    } else if (name === 'globalPosition') {
        changeAnimationOptionsCompareWithGlobalPosition(e);
        config[prop] = input.dataset.globalPosition;
    } else if (name === 'type') {
        checkedType = input.getAttribute('class');
    }

    previewConfig(config);
};

// get the option from select and paste it to the config
let setAnimationType = (e) => {
    if (e.target.classList.contains('animations')) {
        let select = e.target;
        config[select.dataset.animationType] = select.options[select.selectedIndex].innerText;
    }

    previewConfig(config)
};

let randomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand);
};

// get selected type
getType = () => {
    let type = 'random';
    if (checkedType === 'random') {
        type = typePreset[randomInteger(0, typePreset.length - 1)];
    } else {
        type = checkedType
    }
    return type;
};

// show notification on trigger
let showNotification = () => {
    let customText = textArea.value;
    let content = customText || text[randomInteger(0, text.length - 1)];
    let type = getType();

    notification.configuration(config);
    notification.notify(content, type)
};

// clear all notifications
let removeAllNotifications = () => {
    document.querySelector('.c-notification-wrapper').innerHTML = '';
};

// events
btnWrapper.onclick = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('btn-show-notification')) showNotification();
    if (e.target.classList.contains('btn-remove-notifications')) removeAllNotifications();
};
// TODO: make same logic like above
document.querySelector('.btn-show-notification').onclick = () => { showNotification() };

configWrapper.onchange = (e) => {
    changeConfig(e);
    setAnimationType(e);
    Prism.highlightElement(previewJsConfig);
};