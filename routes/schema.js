'use strict';

exports.Schema = {
    Speaker : {
        collectionName : 'Attendee',
        primaryKey : 'key',
        key: 'String',
        lastName : 'String',
        firstName : 'String',
        middleName : 'String',
        bio : 'String',
        email : 'String',
        professionalTitle : {
            parseName : 'job',
            type : 'String'
        },
        degree: { // The xlsx column name
            type : 'String', // type
            parseName : 'title' // the actual parse db name
        },
        organization: 'String',
        location: 'String',
        isSpeaker : {
            type : 'Boolean',
            default: true
        },
        isContactable : 'Boolean'
    },
    Attendee : {
        collectionName : 'Attendee',
        primaryKey : 'key',
        key: 'String',
        lastName : 'String',
        firstName : 'String',
        middleName : 'String',
        email : 'String',
        professionalTitle : {
            parseName : 'job',
            type : 'String'
        },
        degree: {
            type : 'String',
            parseName : 'title'
        },
        organization : 'String',
        location: 'String',
        isSpeaker : {
            type : 'Boolean',
            default: false
        },
        isContactable : 'Boolean'
    },
    Event : {
        collectionName : 'Event',
        primaryKey : 'key',
        key: 'String',
        talkIndividualEvents :{
            type : 'String',
            parseName : 'name'
        },
        trackSessionName : {
            type : 'Pointer',
            parseName : 'session',
            pointerTo : 'Session',
            query : 'track'// Which field in Session to look at
        },
        startTime : 'Date',
        endTime : 'Date',
        speakers : {
            type : 'Relation',
            pointerTo : 'Attendee',
            query : 'name'
        }
    },
    Session : {
        collectionName : 'Session',
        primaryKey : 'startTime',
        trackSessionName : {
            parseName : 'track',
            type : 'String'
        },
        startTime : 'Date',
        endTime : 'Date',
        moderator : 'String',
        location : 'String'
    },
    Sponsor : {
        collectionName : 'Sponsor',
        primaryKey : 'key',
        key: 'String',
        order: 'Number',
        name: 'String',
        sponsoring: {
            parseName : 'type',
            type : 'String'
        },
        website: 'String'
    },
    TravelBusiness: {
        collectionName : 'TravelBusiness',
        primaryKey : 'key',
        key: 'String',
        businessName: 'String',
        address: 'String',
        businessType: 'String',
        otherDetails: 'String',
        reservationAndRates : {
            parseName : 'rates',
            type : 'String'
        },
        website: 'String'
    }
};
