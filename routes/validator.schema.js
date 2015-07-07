
// requiredLevel -
//    1 = medium priority
//    2 = high priority

module.exports = {
        Attendee:{
            Experience: String,
            Title: { type: String, requiredLevel: 1 },
            Name: { type: String, requiredLevel: 2 },
            Email: { type: String, requiredLevel: 2 },
            IsContactable: { type: String, requiredLevel: 2 },
            Bio: { type: String, requiredLevel: 1 },
            Organization: { type: String, requiredLevel: 1 },
            Session: { type: String, requiredLevel: 2 },
            ImageFileName: String
        },
        Session:{
            Track: { type: String, requiredLevel: 2 },
            //Summary: { type: String, requiredLevel: 1 },
            Moderator: { type: String, requiredLevel: 1 },
            Location: { type: String, requiredLevel: 1 }
        },
        event:{
            Name: { type: String, requiredLevel: 2 },
            Date: { type: String, requiredLevel: 2 },
            StartTime: { type: String, requiredLevel: 2 },
            EndTime: { type: String, requiredLevel: 2 },
            Speaker: { type: String, requiredLevel: 2 },
            Track: { type: String, requiredLevel: 2 },
            Description: { type: String, requiredLevel: 1 },
            SlideName: null
        },
        Sponsor:{
            Name: { type: String, requiredLevel: 2 },
            Type: { type: String, requiredLevel: 2 },
            Website: { type: String, requiredLevel: 2 },
            logoName:{ type: String, requiredLevel: 2 }
        }
};
