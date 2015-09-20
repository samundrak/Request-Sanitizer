var _ = require('underscore');
var validator = require('validator');


var obj = {
    email: validator.normalizeEmail,
    string: [validator.ltrim, validator.rtrim]
}

var value = {
    email: "samundrak@YAHOO.com",
    string: "    <html>hello</html>    "
}

console.log(eachRecursive(value, obj));

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
                            return current + 'ss';
                        });
                    }
                }
                if (typeof obj[key] != 'function' && !Array.isArray(obj[key])) {
                    //Sanitization for string

                    if (filter && !_.isEmpty(filter)) {
                        //if filter is available
                        for (var filterKey in filter) {

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
                    } else {

                    }
                }
            }
        }
    }
    return obj;
}


module.exports = function(req, res, next,options) {
    if (!req && !req && !next) return next();
    if (_.isEmpty(req.body) && _.isEmpty(req.query)) return next();
    if (!options && _.isEmpty(req.body)) return next();


    for (var key in options) {
        if (options.hasOwnProperty(keys)) {
            if (options.key === 'query' && options.query) {
                if(options.hasOwnProperty('filter') && options.filter && !_.isEmpty(options.filter)) req.body = eachRecursive(req.body);
            } else if (options.key === 'body' && options.body) {
                if(options.hasOwnProperty('filter') && options.filter && !_.isEmpty(options.filter)) req.query = eachRecursive(req.query);
            }
        }
    }

    return next();
}