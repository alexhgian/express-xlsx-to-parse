'use strict';

var _ = require('underscore');

var Schema = require('./validator.schema');

module.exports = {
    getSchema: function(){
        return Schema;
    },
    validate : function(data){
        var res = findMissingFieldSchema(data.attendee, Schema.attendee);
        return { msg: res.messageString, err : res.hasError };
    }
};


function findMissingFieldSchema(data, subschema){
    var hasError = false;
    var messageString = '';
    var containsSchema = _.difference(_.keys(subschema), _.keys(data));
    _.each(containsSchema, function(val, key) {
        hasError = true;
        var errorMessage = 'The excel is missing the required column: ' + val + '\n';
        messageString += errorMessage;

        return { msg: messageString, err: hasError};
    }
