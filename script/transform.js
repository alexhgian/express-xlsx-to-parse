'use strict';
module.exports = function(Parse){


    function matchSchema(key, value, schema){
        var keyClassName;
        if(schema[key] && schema[key].className){
            keyClassName = schema[key].className;
        }
        var className = keyClassName || schema.className;
        console.log('Class: ' + className);

        switch(key){
            case 'number':
            break;
            case 'string':
            break;
            case 'boolean':
            break;
            case 'relation':
            break;
            case 'pointer':
            break;
            case 'file':
            break;
            case 'date':
            break;
        }
    }

    return matchSchema;
};
