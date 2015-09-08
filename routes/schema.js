'use strict';

exports.Schema = {
    Speaker : {
        collectionName : 'Attendee',
        primaryKey : 'name',
        name : 'String',
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
        isSpeaker : {
            type : 'Boolean',
            default: true
        },
        isContactable : 'Boolean'
    },
    Attendee : {
        collectionName : 'Attendee',
        primaryKey : 'name',
        name : 'String',
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
            query : 'trackSessionName'// Which field in Session to look at
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
        key : 'String', // A Combination of name + track use for search
        trackSessionName : 'String',
        startTime : 'Date',
        endTime : 'Date',
        moderator : 'String' ,
        location : 'String'
    },
    Sponsor : {
        collectionName : 'Sponsor',
        primaryKey: 'name',
        order: 'Number',
        name: 'String',
        sponsoring: {
            parseName : 'type',
            type : 'String'
        },
        website: 'String',
    },
    TravelBusiness: {
        collectionName : 'TravelBusiness',
        primaryKey: 'businessName',
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
