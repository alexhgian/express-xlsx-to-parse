
module.exports = {
        attendee:{
            experience: String,
            title: { type: String, require: true},
            name: { type: String, require: true},
            email: { type: String, require: true},
            isContactable: { type: String, require: true},
            bio: { type: String, require: true},
            organization: { type: String, require: true},
            session: { type: String, require: true},
            imageFileName: String
        },
        session:{
            name: null,
            summary: null,
            moderator: null,
            location: null
        },
        event:{
            name: null,
            date: null,
            startTime: null,
            endTime: null,
            speaker: null,
            track: null,
            description: null,
            slideName: null
        },
        sponsor:{
            name: null,
            type: null,
            website: null,
            logoName: null
        }
};
