export var isAndroid = function () {
    return navigator.userAgent.toLowerCase().indexOf('android') > -1;
};
export var isIos = function () {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ].includes(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};
