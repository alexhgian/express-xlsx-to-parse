'use strict';

var _ = require('underscore');

var Schema = require('./validator.schema');

module.exports = {
    getSchema: function(){
        return Schema;
    },
    validate : function(data){
        var hasError = false;
        var sheetObject = {};

        // Get each sheet
        _.each(data, function(val, key){
            console.log('>>>>>>>>>>>>>>>> ' + key + ' : ' + val.length);

            var sheetMessages = [];

            // Loop through each row
            _.each(val, function(rowVal, rowKey){

                var res = findMissingFieldSchema(rowVal, Schema[key], rowKey);
                sheetMessages.push(res.msg);
                // Only if a required field is missing
                if(res.err){
                    hasError = true;

                }

            });
            sheetObject[key] = sheetMessages;


        });
        return {status: sheetObject, err: hasError};
    }
};

function findMissingFieldSchema(data, subschema, rowNum){
    var hasError = false;
    var messageString = [];

    _.each(subschema, function(schemaVal, key) {
        var value =  data[key];
        // If they have a value
        if(!value){
            if(schemaVal){
                // Check schema for the required level
                var level = schemaVal.requiredLevel;
                var requiredStatus = {};
                // Check to see the exact level
                if( level ){
                    switch( level ) {
                        case 2:
                        //console.log('row: [' + rowNum + '] column: [' + key + '] is required!');
                        requiredStatus.rowNum = rowNum;
                        requiredStatus.key = key;
                        requiredStatus.requiredLevel = 2;
                        hasError=true;
                        break;
                        case 1:
                        //console.log('row: [' + rowNum + '] column: [' + key + '] is recommended, but not necessary!');
                        requiredStatus.rowNum = rowNum;
                        requiredStatus.key = key;
                        requiredStatus.requiredLevel = 1;
                        break;
                        default:
                        requiredStatus.rowNum = null;
                        requiredStatus.key = null;
                        requiredStatus.requiredLevel = 0;
                        break;
                    }
                    messageString.push(requiredStatus);
                }
            }

        }
    });
    return { msg: messageString, err: hasError };
}
