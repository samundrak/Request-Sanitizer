var _ = require('underscore');
var validator = require('validator');

function eachRecursive(obj, filter) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            //if typeof property is object then go on recursive mode
            if (typeof obj[key] === "object") {
                eachRecursive(obj[key]);
            } else {

                if (Array.isArray) {
                    if (Array.isArray(obj[key])) {
                        obj[key] = _.map(obj[key], function(current) {
                            if (typeof filter[key] === 'function') return filter[key](current);
                            else return current;
                        });
                    }
                }
                if (typeof obj[key] != 'function' && !Array.isArray(obj[key])) {
                    //Sanitization for string

                    if (filter && !_.isEmpty(filter)) {
                        //if filter is available

                        for (var filterKey in filter) {

                            if (filterKey === key) {
                                if (Array.isArray(filter[filterKey])) {
                                    //property of filter is array
                                    filter[filterKey].forEach(function(current) {
                                        if (typeof current === 'function') {
                                            obj[key] = current(obj[key]);
                                        }
                                    });
                                } else {
                                    if (key === filterKey) {
                                        if (typeof filter[filterKey] != 'number' && typeof filter[filterKey] != 'string') {
                                            if (typeof filter[filterKey] === 'function') {
                                                obj[key] = filter[filterKey](obj[key]);
                                            } else if (validator.isBoolean(filter[filterKey])) {
                                                if (filter[filterKey]) {
                                                    obj[key] = validator.toString(validator.escape(validator.ltrim(validator.rtrim(obj[key]))));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                    } else {

                    }
                }
            }
        }
    }
    return obj;
}


module.exports = sanitizer = function() {

    return new function() {
        var opt = undefined;
        this.validator = validator;
        this.setOptions = function(options) {
            opt = options;
        }

        this.sanitize = function(req, res, next, bool) {

            this.options = opt;
            if (!req && !req && !next) return next();
            // if (_.isEmpty(req.body) && _.isEmpty(req.query)) return next();
            if (!this.options && _.isEmpty(req.body)) return next();

            for (var key in this.options) {
                var filter = {};
                for (var filterKey in this.options[key]) {
                    filter[filterKey] = this.options[key][filterKey]
                }
                req[key] = eachRecursive(req[key], filter);
            }
            if (bool) return req[bool];
            return next();
        }
    }
}