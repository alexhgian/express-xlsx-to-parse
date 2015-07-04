'use strict';


// Setting Up
var express = require('express');
var router = express.Router();
var assert = require('assert');
var _ = require('underscore');

var Validator = require('../routes/validator.controller');
var successData = {
    attendee:[{
        experience: 'Test Experience',
        name: 'Alex',
        bio: 'hi',
        title: 'Title Test',
        email: 'test@test.com',
        isContactable: true,
        organization: 'Ointerface',
        session: 'Wellness Matters',
        imageFileName: 'test.jpg'
    },{
        experience: 'Test Experience',
        title: 'Title Test',
        name: 'Alex',
        bio: 'hi',
        email: 'test@test.com',
        isContactable: true,
        organization: 'Ointerface',
        session: 'Wellness Matters',
        imageFileName: 'test.jpg'
    }],
    // session:[{}],
    // event:[{}],
    // sponsor:[{}]
};

var failData = {
    attendee:[{
        experience: 'Test Experience',
        name: 'Alex',
        title: 'Title Test',
        email: 'test@test.com',
        isContactable: true,
        organization: 'Ointerface',
        session: 'Wellness Matters',
        imageFileName: 'test.jpg'
    },{
        experience: 'Test Experience',
        title: 'Title Test',
        bio: 'hi',
        email: 'test@test.com',
        isContactable: true,
        organization: 'Ointerface',
        session: 'Wellness Matters',
        imageFileName: 'test.jpg'
    }],
    // session:[{}],
    // event:[{}],
    // sponsor:[{}]
};
/**** Test ****/
// describe('The Schema', function(){
//     it('should have Attendee', function(){
//         var Schema = Validator.getSchema();
//         assert.equal(Schema.attendee ? true : false, true);
//     });
// });
describe('The Validator', function() {
    it('should have all required fields', function(){
        var results = Validator.validate(successData);

        if(results.err){
            console.error('A required field was missing!');
            console.log('Number of errors: ' + JSON.stringify(results.status, null, 2));
        } else {
            console.log('No errors!');
        }
        assert.equal(results.err, false);
    });
    it('should have missing required fields', function(){
        var results = Validator.validate(failData);

        if(results.err){
            console.error('A required field was missing!');
            console.log('Number of errors: ' + JSON.stringify(results.status, null, 2));
        } else {
            console.log('No errors!');
        }
        assert.equal(results.err, true);
    });
});
