var Events = /** @class */ (function () {
    function Events() {
        this.handlers = {};
    }
    Events.prototype.on = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.handlers[args[0]])
            this.handlers[args[0]] = [];
        this.handlers[args[0]].push(args[1]);
    };
    Events.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.handlers[args[0]])
            this.handlers[args[0]] = [];
        for (var _a = 0, _b = this.handlers[args[0]]; _a < _b.length; _a++) {
            var h = _b[_a];
            h(args[1]);
        }
    };
    Events.prototype.off = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.handlers[args[0]])
            this.handlers[args[0]] = [];
        if (args[1]) {
            this.handlers[args[0]] = this.handlers[args[0]].filter(function (h) { return h !== args[1]; });
        }
        else {
            this.handlers[args[0]] = [];
        }
    };
    return Events;
}());
export { Events };
