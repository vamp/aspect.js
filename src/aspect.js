/*!
 * Aspect (AOP) JavaScript Library v0.0.1
 *
 * Copyright 2012, Denis Gulin <denis.gulin@gmail.com>
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Mon Jun 11 15:00:12 2012 +0300
 */

/**
 * @param {Array} events
 * @param {Function} invoke
 * @param {Object} extensions
 * @return {Function}
 */
var Aspect = (function (events, invoke, extensions) {
    var prop = "__aspect_id__",
		meta = {},
		count = 1,
		slice = Array.prototype.slice,
		push = Array.prototype.push;

    /**
    * @param {Object} target
    * @param {Object} source
    * @return {Object}
    */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    /**
    * @param {Function} fn
    * @param {Object} context
    * @return {Function}
    */
    function methodize(fn, context) {
        return function () {
            return fn.call(this, context, slice.call(arguments, 0));
        };
    }

    /**
    * @param {Function|Object} target
    * @return {Object}
    */
    function resolve(target) {
        // get cached object
        if (prop in target) {
            return meta[target[prop]];
        }

        // add all events to target object
        for (var object = { 'list': {}, 'target': target }, i = 0, j = events.length, name; name = events[i], i < j; i++) {
            target[name] = methodize(prototype[name], object);
            for (var key in prototype[name]) {
                if (prototype[name].hasOwnProperty(key)) {
                    target[name][key] = methodize(prototype[name][key], object);
                }
            }
        }

        // save in cache
        return (meta[target[prop] = count++] = object);
    }

    /**
    * @param {String} name
    * @return {Function}
    */
    function list(name) {
        return extend(function (context, args) {
            var target = ('function' === typeof (this))
				? this
				: prototype(this, args.shift());

            target[name]['add'].apply(target, args);
            return this;
        }, extend({
            'add': function add(context, args) {
                push.apply(context['list'][name] || (context['list'][name] = []), args);
                return this;
            },
            'remove': function remove(context, args) {
                for (var i = 0, j = args.length, list = context['list'][name] || []; i < j; i++) {
                    for (var m = 0, n = list.length; m < n; m++) {
                        (list[m] !== args[i]) || list.splice((--n, m--), 1);
                    }
                }
                return this;
            },
            'valueOf': function valueOf(context) {
                return context['list'][name] || [];
            }
        }, ('function' === typeof (extensions)) && extensions.call(this, name) || extensions || {}));
    }

    /**
    * @param {Object} target
    * @param {undefined|String} fn
    * @return {Object|Function}
    */
    function prototype(target, fn) {
        var object = resolve(target);
        if ('function' !== typeof (target)) {
            if (fn && !target[fn]) {
                throw new Error("Can not find " + fn + " in given object.");
            }
            return (fn && target[fn])
				? (target[fn] = prototype(target[fn]))
				: target;
        }
        // function!
        return extend(methodize(invoke, object), target);
    }

    // Add collection for events in object
    for (var i = 0, j = events.length, name; name = events[i], i < j; i++) {
        prototype[name] = list(name);
    }

    // return prototype
    return prototype;

    // here is custom events & custom invoke method
})(['before', 'after', 'around'], function invoke(context, args) {
    var all = context['list'],
		target = context['target'],
		list, i, j,
		result,
		value;

    // Evaluation before list
    if ((list = all['before'])) {
        for (i = list.length - 1; i > -1; i--) {
            if (null != (value = list[i].apply(null, args))) {
                return value;
            }
        }
    }

    // Evaluation around list
    if ((list = all['around'])) {
        for (i = 0, j = list.length; i < j; i++) {
            target = (function (target, around, args) {
                return function() {
                    return around.call(this, target, args);
                };
            })(target, list[i], args);
        }
    }

    // Get function result
    result = target.apply(this, args);

    // Evaluation after list
    if ((list = all['after'])) {
        var argsWithResult = [result].concat(args);
        for (i = 0, j = list.length; i < j; i++) {
            if (null != (value = list[i].apply(null, argsWithResult))) {
                return value;
            }
        }
    }

    return result;
});