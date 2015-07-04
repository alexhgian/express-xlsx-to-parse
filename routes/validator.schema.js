
// requiredLevel -
//    1 = medium priority
//    2 = high priority

module.exports = {
        attendee:{
            experience: String,
            title: { type: String, requiredLevel: 1 },
            name: { type: String, requiredLevel: 2 },
            email: { type: String, requiredLevel: 2 },
            isContactable: { type: String, requiredLevel: 2 },
            bio: { type: String, requiredLevel: 1 },
            organization: { type: String, requiredLevel: 1 },
            session: { type: String, requiredLevel: 2 },
            imageFileName: String
        },
        session:{
            name: { type: String, requiredLevel: 2 },
            summary: { type: String, requiredLevel: 1 },
            moderator: { type: String, requiredLevel: 1 },
            location: { type: String, requiredLevel: 1 }
        },
        event:{
            name: { type: String, requiredLevel: 2 },
            date: { type: String, requiredLevel: 2 },
            startTime: { type: String, requiredLevel: 2 },
            endTime: { type: String, requiredLevel: 2 },
            speaker: { type: String, requiredLevel: 2 },
            track: { type: String, requiredLevel: 2 },
            description: { type: String, requiredLevel: 1 },
            slideName: null
        },
        sponsor:{
            name: { type: String, requiredLevel: 2 },
            type: { type: String, requiredLevel: 2 },
            website: { type: String, requiredLevel: 2 },
            logoName:{ type: String, requiredLevel: 2 }
        }
};
