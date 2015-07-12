'use strict';
var transform = require('transform');

function ParseFactory(Parse){
    return {
        transform : transform(Parse)
    };
}

module.exports = ParseFactory;
