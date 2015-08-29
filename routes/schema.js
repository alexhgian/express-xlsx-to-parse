'use strict';

exports.Schema = {
    Speaker : {
        collectionName : 'Attendee',
        primaryKey : 'name',
        image : 'File',
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
        imageFileName : {
            type : 'File',
            parseName : 'image'
        },
        name : 'String',
        bio : 'String',
        email : 'String',
        professionalTitle : {
            parseName : 'job',
            type : 'String'
        },
        degree: {
            type : 'String',
            parseName : 'title'
        },
        affiliation : 'String',
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
        talk :{
            type : 'String',
            parseName : 'name'
        },
        track : {
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
        },
        presentation : 'File',
        abstract : 'File',
        journal : 'File',
        misc : 'File'
    },
    Session : {
        collectionName : 'Session',
        primaryKey : 'track',
        key : 'String', // A Combination of name + track use for search
        track : 'String',
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
        Sponsoring: {
            parseName : 'type',
            type : 'String'
        },
        website: 'String',
        logoName : {
            type : 'File',
            parseName : 'logo'
        }
    },
    TravelBusiness: {
        collectionName : 'TravelBusiness',
        primaryKey: 'businessName',
        businessName: 'String',
        address: 'String',
        businessType: 'String',
        otherDetails: 'String',
        ReservationAndRates : {
            parseName : 'rates',
            type : 'String'
        },
        website: 'String'
    }
};
