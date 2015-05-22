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
        primatives: ['description', 'name']
    },
    Session : {
        collectionName : 'Session',
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
        primatives: ['description', 'name']
        //TODO: Add default value keypair
        //TODO: Handle Boolean
    }
}
