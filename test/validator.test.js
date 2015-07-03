'use strict';


// Setting Up
var express = require('express');
var router = express.Router();
var assert = require('assert');
var _ = require('underscore');

var Validator = require('../routes/validator.controller');
var testData = {
        attendee:{
            experience: 'Test Experience',
            title: 'Title Test',
            email: 'test@test.com',
            isContactable: true,
            bio: 'Test Bio',
            organization: 'Ointerface',
            session: 'Wellness Matters',
            imageFileName: 'test.jpg'
        },
        session:{},
        event:{},
        sponsor:{}
};
/**** Test ****/
describe('The Schema', function(){
    it('should have Attendee', function(){
        var Schema = Validator.getSchema();
        assert.equal(Schema.attendee ? true : false, true);
    });
});
describe('The Validator', function() {
    it('should take an object', function(){
        var results = Validator.validate(testData);
        console.log(results);
        assert.equal(typeof results, typeof {});

    });

    it('should take an have required fields', function(){
        var results = Validator.validate(testData.attendee);
        console.log(results.msg);
    });
});
