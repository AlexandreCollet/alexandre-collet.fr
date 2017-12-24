Object.defineProperty(Element.prototype, 'outerHeight', {
    enumerable: true,
    configurable: false,
    get: function() {
        var height = this.offsetHeight;
        var style = getComputedStyle(this);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    },
})
