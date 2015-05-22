'use strict';

exports.Schema = {
    Event : {
        collectionName : 'Event',
        pointer : [{
            name : 'session',
            pointerTo : 'Session'
        }],
        dateTime : ['startTime', 'endTime'],
        relation:[{
            name : 'speakers',
            pointerTo : 'Attendee'
        }],
        file: ['slideName'],
        primatives: [{
            name: 'description'
        },{
            name: 'name'
        }]
    },
    Speaker : {
        collectionName : 'Attendee',
        pointer : [],
        dateTime : [],
        relation:[],
        file: [],
        primatives: [{
            name: 'bio'
        },{
            name: 'email'
        },{
            name: 'experience'
        },{
            name: 'title'
        },{
            name: 'organization'
        },{
            name: 'isSpeaker',
            default: true
        }]
    },
    Attendee : {
        collectionName : 'Attendee',
        pointer : [],
        dateTime : [],
        relation:[],
        file: [],
        primatives: [{
            name: 'bio'
        },{
            name: 'email'
        },{
            name: 'experience'
        },{
            name: 'title'
        },{
            name: 'organization'
        },{
            name: 'isSpeaker',
            default: false
        }]
    }
}
