'use strict';
var _ = require('underscore');

exports.Undupe = function(Parse) {
    var saver = {};

    // Array Remove - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    function compareKey2(arr1, arr2, compareKey, callback) {
        var cb = callback || function() {}; // Optionally
        var tmpList = [];
        arr1.forEach(function(arr1Val, key1) {
            arr2.forEach(function(arr2Val, key2) {
                //console.log(arr1Val);
                if (arr1Val.get(compareKey) == arr2Val.get(compareKey)) {
                    extendObject(arr2Val, arr1Val);
                    cb(arr1Val, arr2Val);
                    arr2.remove(key2);
                }
            });
            tmpList.push(arr1Val); // Push Objects
        });
        return tmpList;
    }

    function extendObject(dest, source) {
        var newObj = _.extend(dest.toJSON(), source.toJSON());

        _.forEach(newObj, function(val, key) {
            source.set(key, val);
        });
        return source;
    }

    saver.saveWithoutDupe = function(list, cKey) {
        var savePromise = new Parse.Promise();      
        var query = new Parse.Query(list[0].className);
        query.find({
            success: function(results) {
                // results is an array of Parse.Object.
                var tmp = compareKey2(list, results, cKey);

                Parse.Object.saveAll(tmp, {
                    success: function(list) {
                        // All the objects were saved.
                        savePromise.resolve(list);
                    },
                    error: function(error) {
                        // An error occurred while saving one of the objects.
                        savePromise.resolve(error);
                    },
                });
            },
            error: function(error) {
                // error is an instance of Parse.Erro1r.
            }
        });
        return savePromise;
    }

    return saver;
};
