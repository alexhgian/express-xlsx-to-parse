// 'use strict';
//
// var express = require('express');
//
// var XLSX = require('xlsx');
// var Parse = require('parse').Parse;
// var _ = require('underscore');
//
// var assert = require("assert");
//
// var Schema2 = require("../routes/schema2").Schema;
//
//
// /* GET users listing. */
// Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');
//
// // Assoicate Conference Id to all Rows
// var Conference = Parse.Object.extend("Conference");
// var conference = new Conference();
// conference.id = 'yVEOkRMQ5w';
//
//
// /*********** Parse Util Begin ************/
// var ParseUtil = {
//     setPointer : function(val, collection) {
//         var Collect = Parse.Object.extend(collection);
//         var collect = new Collect();
//         collect.id = val;
//         return collect;
//     },
//     find : function(val, collection, cb){
//         var Collection = Parse.Object.extend(collection);
//         var query = new Parse.Query(Collection);
//
//         query.equalTo("name", val.trim());
//         return query.find({
//             success: function(results) {
//                 // console.log("Successfully retrieved " + results.length + " "+collection+"s.");
//
//                 if(results[0]){
//                     cb(ParseUtil.setPointer(results[0].id, collection), false);
//                 } else {
//                     cb(null,'Invaid ID');
//                 }
//             },
//             error: function(error) {
//                 // console.log("Error: " + error.code + " " + error.message);
//                 cb(null, error);
//             }
//         });
//
//     }
// }
// /*********** Parse Util End ************/
//
// /*********** Mock Data      ************/
// var xlsxData = {
//     Speaker : [{
//         'Name' : 'Deepak Chopra',
//         'Email' : 'Deepak@Chopra.com',
//         'Title' : 'MDPHDDDRABC',
//         'Bio': 'Cool guy',
//         'IsContactable': 'yes',
//         'Organization':'Scripps',
//         'Experience': 'CEOing',
//         'Image':'2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg'
//     }],
//     Event : [{
//         'name' : 'Wellness Matters',
//         'speakers' : 'Deepak Chopra, Gary Conkright,Richard J. Boxer',
//         'description' : 'Being Well in the 33rd century',
//         'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
//         'conference': 'x9e1mtYnwH',
//         'Track': 'Morning Session I',
//         'date':'10/17/1991',
//         'startTime':'9:59 AM',
//         'endTime':'10:59 AM'
//     }]
// };
//
// var CollectionMapper2 = function(conference, rowData, schema, callback) {
//     var cb = callback || _.noop; // Optional Callback
//     var promises = [];
//
//     /*************************************
//     Select collection
//     **************************************/
//     var Col = Parse.Object.extend(schema.collectionName);
//     var col = new Col();
//
//     col.set('conference', conference);
//
//
//     // Check schema for default values and set them.
//     _.forEach(schema, function(val, key){
//         // console.log(key + ' : ' + val + ' has default ' + (val.default!=undefined) )
//         if( val.default!=undefined ) {
//             console.log('    > Setting default for ' + key + ' = ' + val.default );
//             col.set(key, val.default);
//         }
//     });
//
//
//     // Start mapping the rows
//     _.forEach(rowData, function(val, key){
//         var field = schema[key];
//         if(field){
//             if(field.default){
//                 console.log('Default Override: ' + field.default);
//             } else {
//                 switch(field.type || field){
//                     // String and Number
//                     case 'String':
//                     case 'Number':
//                     col.set(field.parseName || key, val);
//                     console.log('    > Number or String: ' + val);
//                     break;
//
//                     // Handle Boolean
//                     case 'Boolean':
//                     col.set(field.parseName || key, val.toLowerCase()=='yes' || val==true || val=='true');
//                     console.log('    > Boolean');
//                     break;
//
//
//                     // Handle Date
//                     case 'Date':
//                     var dt = new Date(val);
//                     if(dt.toString()=='Invalid Date'){
//                         dt = new Date((new Date()).toDateString() + ' ' + val);
//                     }
//                     if(dt.toString()!='Invalid Date'){
//                         col.set(field.parseName || key, dt);
//                     }
//                     console.log('    > Date');
//                     break;
//
//
//                     /*************************************
//                     Handle File
//                     **************************************/
//                     case 'File':
//                     var Uploads = Parse.Object.extend('Uploads');
//                     var query = new Parse.Query(Uploads);
//                     query.equalTo("name", val);
//                     var fPromise = query.find({
//                         success: function(results) {
//                             // console.log("Successfully retrieved " + results.length + " Uploads.");
//                             if(results[0]) {
//                                 col.set(field.parseName || key, results[0].get('file'));
//                             }
//                         },
//                         error: function(error) {
//                             // console.log('Error getting files!');
//                         }
//                     });
//                     promises.push(fPromise); // Add to list of promises
//
//                     console.log('    > File')
//                     break;
//
//
//                     /*************************************
//                     Pointer Date
//                     **************************************/
//                     case 'Pointer':
//                     var pPromise = ParseUtil.find(val, field.pointerTo, function(data, err){
//                         if(err) { return err; }
//                         col.set(field.parseName || key, ParseUtil.setPointer(data.id, field.pointerTo));
//                     });
//                     promises.push(pPromise); // Add to list of promises
//                     console.log('    > Pointer')
//                     console.log('    >> ' + val)
//                     break;
//
//
//                     /*************************************
//                     Relation Date
//                     **************************************/
//                     case 'Relation':
//                     _.forEach(val.split(','), function(rVal, rKey){
//                         var sPromise = ParseUtil.find(rVal, field.pointerTo, function(data, err){
//                             if(err) { return err; }
//                             var colRel = col.relation(field.parseName || key);
//                             colRel.add(data);
//                         });
//                         promises.push(sPromise); // Add to list of promises
//                     });
//                     console.log('    > Relation')
//                     break;
//                 }
//             }
//         }
//
//     });
//
//     /**************************************
//     *           Handle Promises           *
//     **************************************/
//     return Parse.Promise.when(promises).then(function(){
//         // console.log(schema.collectionName + ' Promises finished');
//         cb(col, false);
//     }).fail(function(){
//         cb(null, true);
//     });
// };
//
//
// describe('Mapping', function() {
//     it('should work', function(done){
//         var list = [];
//         var promises = [];
//
//         _.forEach(xlsxData['Event'], function(row, key){
//             var tmpInvObj = _.invert(row);
//             tmpInvObj = _.mapObject(tmpInvObj, function(val, key){
//                 return lowerFirst(val);
//             });
//             var newRowData = _.invert(tmpInvObj);
//
//             //Loop Start
//             var rowPromise = CollectionMapper2(conference, newRowData, Schema2['Event'],function(data){
//                 list.push(data);
//             });
//             promises.push(rowPromise);
//             //Loop End
//         });
//
//         Parse.Promise.when(promises).then(function(data){
//             Parse.Object.saveAll(list, {
//                 success: function(data) {
//                     // Execute any logic that should take place after the object is saved.
//                     console.log('    > Objects [' + data.length + '] saved!');
//                     // res.json(data);
//                     // console.log(data);
//                     done();
//                 },
//                 error: function(data, error) {
//                     // Execute any logic that should take place if the save fails.
//                     // error is a Parse.Error with an error code and message.
//                     // console.log('Failed to create new object, with error code: ');
//                     // console.log(data);
//                 }
//             });
//         });
//     });
// });
//
// function lowerFirst(string) {
//     return string.charAt(0).toLowerCase() + string.slice(1);
// }
