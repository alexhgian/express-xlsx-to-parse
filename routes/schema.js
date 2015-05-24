'use strict';

exports.Schema = {
    Speaker : {
        collectionName : 'Attendee',
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
        track : {
            type : 'Pointer',
            parseName : 'session',
            pointerTo : 'Session',
            query : 'track'
        },
        startTime : 'Date',
        endTime : 'Date',
        speakers : {
            type : 'Relation',
            pointerTo : 'Attendee',
            query : 'name'
        },
        slideName : 'File',
        description : 'String',
        talk :{
            type : 'String',
            parseName : 'name'
        }
    },
    Session : {
        collectionName : 'Session',
        name : 'String',
        track : 'String',
        startTime : 'Date',
        endTIme : 'Date',
        moderator : 'String' ,
        location : 'String'
    },
    Sponsor : {
        collectionName : 'Sponsor',
        order: 'Number',
        name: 'String',
        type: 'String',
        website: 'String',
        logoName : {
            type : 'File',
            parseName : 'logo'
        }
    }
}