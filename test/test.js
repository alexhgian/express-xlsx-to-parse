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
                'talk' : 'Wellness Matters',
                'speakers' : 'Deepak Chopra, Gary Conkright',
                'description' : 'Being Well in the 33rd century',
                'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
                'track': 'NewTrack2',
                'startTime':'10/17/1991 9:59 AM',
                'endTime':'10/17/1991 10:59 AM'
            },{
                'talk' : 'Robots Matters',
                'speakers' : 'Gary Conkright',
                'description' : 'Arduino Microcontrollers',
                'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
                'track': 'NewTrack2',
                'startTime':'10/17/1991 9:59 AM',
                'endTime':'10/17/1991 10:59 AM'
            }],
            Session : [{
                'name' : 'Morning Session II',
                'track' : 'NewTrack2',
                'moderator' : 'Raj',
                'startTime':'10/17/1991 9:59 AM',
                'endTime':'10/17/1991 10:59 AM'
            }],
            Speaker : [{
                'firstName' : 'Deepak',
                'lastName' : 'Chopra',
                'email' : 'Deepak@Chopra.com',
                'ProfessionalTitle' : 'MDPHDDDRABC',
                'bio': 'Cool guy',
                'degree':'MD',
                'isContactable': 'yes',
                'organization':'Scripps',
                'experience': 'CEOing',
                'image':'2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg'
            }],
            Attendee : [{
                'firstName' : 'Alex',
                'lastName' : 'Gian',
                'email' : 'AlexHGian@gmail.com',
                'ProfessionalTitle' : 'Developer',
                'bio': 'N/A',
                'degree':'PHD',
                'isContactable': 'yes',
                'affiliation':'Scripps',
                'image':'2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg'
            }]

        };

        // The before() callback gets run before all tests in the suite. Do one-time setup here.
    });
    beforeEach(function(){
        // The beforeEach() callback gets run before each test in the suite.
    });

    var p1,p2,p3,p4;
    var list = [];
    var promises = [];

    describe('speaker to parse', function(){
        it('should save objects', function(done){
            p1 = Mapper(conference, MockData.Speaker, 'Speaker', function(data, err){
                if(err) {return console.log("Error");}
                //console.log("Success Saved P1");
                //assert.equal(1, data.length);
                // assert.equal('Gary Conkright', data[0]._serverData.speakers);
                done();
            });
        });
    });

    describe('attendee to parse', function(d){
        it('should save objects', function(done){
            p2 = Mapper(conference, MockData.Attendee, 'Attendee', function(data, err){
                if(err) {return console.log("Error");}
                console.log("Success Saved P2");
                //console.log(data);
                done();
            });
        });
    });
    describe('session to parse', function(){
        it('should save objects', function(done){
            p3 = Mapper(conference, MockData.Session, 'Session', function(data, err){
                if(err) {return console.log("Error");}
                console.log("Success Saved P2");
                done();
            });
        });
    });

    describe('event to parse', function(){
        it('should save objects', function(done){
            p4 = p3.then(function(){
                Mapper(conference, MockData.Event, 'Event', function(data, err){
                    if(err) {return console.log("Error");}
                    console.log("Success Saved P2");
                    //console.log(data);
                    done();
                });
            });
        });
    });


    describe('promises', function(){
        Parse.Promise.when([p1,p2,p3,p4]).then(function(data,err){
            console.log(data);
            it('should finish without error', function(done){
                if(err) throw err;
                done();
            });



        });
    });
    after(function() {
        // after() is run after all your tests have completed. Do teardown here.
    });
});
