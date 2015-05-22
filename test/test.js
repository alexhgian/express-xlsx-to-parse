'use strict';

var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
var _ = require('underscore');

/* GET users listing. */
Parse.initialize('UnTJ7KjFdK1wNMHkvJBMBAMu4jqh7tog5WZYRJ5c','aT6vbh3DMGGzfxDmcjJH23qsZGts7hop2gTWetFy');
var Mapper = require('../routes/mapper').Mapper(Parse);

// Assoicate Conference Id to all Rows
var Conference = Parse.Object.extend("Conference");
var conference = new Conference();

var MockData;

var assert = require("assert");


describe('Mapping', function() {
    before(function(){
        conference.id = 'yVEOkRMQ5w';
        MockData = {
            Event : [{
                'name' : 'Wellness Matters',
                'speakers' : 'Deepak Chopra, Gary Conkright',
                'description' : 'Being Well in the 33rd century',
                'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
                'conference': 'x9e1mtYnwH',
                'session': 'Morning Session I',
                'date':'10/17/1991',
                'startTime':'9:59 AM',
                'endTime':'10:59 AM'
            },{
                'name' : 'Robots Matters',
                'speakers' : 'Gary Conkright',
                'description' : 'Arduino Microcontrollers',
                'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
                'conference': 'x9e1mtYnwH',
                'session': 'Morning Session I',
                'date':'11/20/2039',
                'startTime':'9:59 AM',
                'endTime':'10:59 AM'
            }],
            Speaker : [{
                'name' : 'Deepak Chopra'
            }]
        };

        // The before() callback gets run before all tests in the suite. Do one-time setup here.
    });
    beforeEach(function(){
        // The beforeEach() callback gets run before each test in the suite.
    });

    var p1;
    var list = [];
    var promises = [];

    describe('events to parse', function(){

        it('should have 2 objects', function(done){
            var p1 = Mapper(conference, MockData.Speaker, 'Speaker', function(data, err){
                if(err) {return console.log("Error");}
                //console.log("Success Saved P1");
                assert.equal(1, data.length);
                // assert.equal('Gary Conkright', data[0]._serverData.speakers);
                done();

            });

        });

        // var p2 = Mapper(conference, sheet, 'Event', function(data, err){
        //     if(err) {return console.log("Error");}
        //     console.log("Success Saved P2");
        //     //console.log(data);
        // });

    });

    describe('and save', function(){
        Parse.Promise.when([p1]).then(function(data,err){
            console.log(data);
            it('without error', function(done){
                if(err) throw err;
                done();
            });



        });
    });
    after(function() {
        // after() is run after all your tests have completed. Do teardown here.
    });
});
