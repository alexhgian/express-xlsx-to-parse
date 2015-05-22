'use strict';
var Schema = require('./schema').Schema;
var _ = require('underscore');

exports.Mapper = function(Parse) {
    function lowerFirst(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    var ParseUtil = {
        setPointer : function(val, collection) {
            var Collect = Parse.Object.extend(collection);
            var collect = new Collect();
            collect.id = val;
            return collect;
        },
        find : function(val, collection, cb){
            var Collection = Parse.Object.extend(collection);
            var query = new Parse.Query(Collection);

            query.equalTo("name", val.trim());
            return query.find({
                success: function(results) {
                    console.log("Successfully retrieved " + results.length + " "+collection+"s.");

                    if(results[0]){
                        cb(ParseUtil.setPointer(results[0].id, collection), false);
                    } else {
                        cb(null,'Invaid ID');
                    }

                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                    cb(null, error);
                }
            });

        }
    }

    var CollectionMapper = function(conference, rowData, schema, callback) {
        var cb = callback || _.noop; // Optional Callback
        var promises = [];

        /*************************************
        Select collection
        **************************************/
        var Col = Parse.Object.extend(schema.collectionName);
        var col = new Col();

        col.set('conference', conference);

        /*************************************
        Processing Primative Data
        **************************************/
        _.forEach(schema.primatives, function(val, key){
            if(rowData[val.name]){
                // If the schema has a default value set that
                if(val.default){
                    col.set(val.name, val.default);
                } else { // if not set the xlsx define value
                    col.set(val.name, rowData[val.name]);
                }
            }
        });

        //var simpleObject = _.pick(rowData, schema.primatives);
        // _.forEach(simpleObject, function(val, key){
        //     col.set(key, val);
        // });

        /*************************************
        Processing Relational Data
        **************************************/
        _.forEach(schema.relation, function(rVal, rKey){
            // TODO: Relational Data
            if(rowData[rVal.name]){
                _.forEach((rowData[rVal.name]).split(','), function(val, key){
                    var sPromise = ParseUtil.find(val, rVal.pointerTo, function(data, err){
                        if(err) { return err; }
                        var colRel = col.relation(rVal.name);
                        colRel.add(data);
                    });
                    promises.push(sPromise); // Add to list of promises
                });
            }
        });


        /*************************************
        Select Pointer Data
        **************************************/
        _.forEach(schema.pointer, function(pVal, pKey){
            if(rowData[pVal.name]){
                var sPromise = ParseUtil.find(rowData[pVal.name], pVal.pointerTo, function(data, err){
                    if(err) { return err; }
                    col.set(pVal.name, ParseUtil.setPointer(data.id, pVal.pointerTo));
                });
                promises.push(sPromise); // Add to list of promises
            }
        });
        /*************************************
        Util
        **************************************/
        // var loopChecker = function(schema.pointer, rowData, cb){
        //     _.forEach(schema.pointer, function(pVal, pKey){
        //         if(rowData[pVal.name]){
        //             cb(rowData[pVal.name], pVal); //cb(Data, SchemaValue)
        //         }
        //     });
        // }

        /*************************************
        Select File Data
        **************************************/

        _.forEach(schema.file, function(pVal, pKey){

            if(rowData[pVal]){
                console.log("Getting files..." + rowData[pVal]);
                var Uploads = Parse.Object.extend('Uploads');
                var query = new Parse.Query(Uploads);
                query.equalTo("name", rowData[pVal]);
                var sPromise = query.find({
                    success: function(results) {
                        console.log("Successfully retrieved " + results.length + " Uploads.");
                        if(results[0]) {
                            col.set(pVal, results[0].get('file'));
                        }
                    },
                    error: function(error) {
                        console.log('Error getting files!');
                    }
                });

                promises.push(sPromise); // Add to list of promises
            }
        });

        /*************************************
        Select Time Date
        **************************************/
        _.forEach(schema.dateTime, function(pVal, pKey){
            if(rowData[pVal]){
                var dt = new Date(rowData[pVal]);
                if(dt.toString()=='Invalid Date'){
                    dt = new Date((new Date()).toDateString() + ' ' + rowData[pVal]);
                }
                console.log(pVal+' '+dt.toString());
                if(dt.toString()!='Invalid Date'){
                    col.set(pVal, dt);
                }
            }
        });

        /*************************************
        Handle Promises
        **************************************/
        Parse.Promise.when(promises).then(function(){
            console.log(schema.collectionName + ' Promises finished');
            cb(col);
        });

        return Parse.Promise.when(promises);
    }

    return function(conference, jsonSheet, sheetName, cb){
        var promises = [];
        var list = [];
        var savePromise;
        _.forEach(jsonSheet, function(row, key){

            var tmpInvObj = _.invert(row);
            tmpInvObj = _.mapObject(tmpInvObj, function(val, key){
                return lowerFirst(val);
            });
            var newRow = _.invert(tmpInvObj);

            var promise = CollectionMapper(conference, newRow, Schema[sheetName], function(data){
                list.push(data);
            });
            promises.push(promise);
        });

        return Parse.Promise.when(promises).then(function(data){


             var tmp = Parse.Object.saveAll(list, {
                success: function(data) {
                    // Execute any logic that should take place after the object is saved.

                    console.log('Objects [' + data.length + '] saved!');
                    //res.json(data);
                    //console.log(data);
                    cb(data, false);
                },
                error: function(data, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new object, with error code: ');
                    console.log(data);
                    cb(data, error);

                }
            });

            return tmp;

        });

        //return Parse.Promise.when(promises);
    }

}
