// requiredLevel -
//    1 = medium priority
//    2 = high priority

module.exports = {
    Attendee: {
        ProfessionalTitle: String,
        firstName: {
            type: String,
            requiredLevel: 2
        },
        middleName: {
            type: String,
            requiredLevel: 2
        },
        lastName: {
            type: String,
            requiredLevel: 2
        },
        Email: {
            type: String,
            requiredLevel: 2
        },
        IsContactable: {
            type: String,
            requiredLevel: 2
        },
        Organization: String,
        Location: String
    },
    Session: {
        TrackSessionName: {
            type: String,
            requiredLevel: 2
        },
        StartTime: {
            type: String,
            requiredLevel: 2
        },
        EndTime: {
            type: String,
            requiredLevel: 2
        },
        Moderator: {
            type: String,
            requiredLevel: 1
        },
        Location: {
            type: String,
            requiredLevel: 1
        }
    },
    Event: {
        TalkIndividualEvents: {
            type: String,
            requiredLevel: 2
        },
        TrackSessionName: {
            type: String,
            requiredLevel: 2
        },
        StartTime: {
            type: String,
            requiredLevel: 2
        },
        EndTime: {
            type: String,
            requiredLevel: 2
        },
        Speakers: {
            type: String,
            requiredLevel: 2
        }
    },
    Speaker: {
        ProfessionalTitle: {
            type: String,
            requiredLevel: 1
        },
        firstName: {
            type: String,
            requiredLevel: 2
        },
        middleName: {
            type: String,
            requiredLevel: 2
        },
        lastName: {
            type: String,
            requiredLevel: 2
        },
        Email: {
            type: String,
            requiredLevel: 2
        },
        IsContactable: {
            type: String,
            requiredLevel: 2
        },
        Bio: {
            type: String,
            requiredLevel: 1
        },
        Organization: {
            type: String,
            requiredLevel: 1
        },
        Location: String
    },
    Sponsor: {
        Name: {
            type: String,
            requiredLevel: 2
        },
        Sponsoring: {
            type: String,
            requiredLevel: 1
        },
        Website: {
            type: String,
            requiredLevel: 1
        }
    },
    TravelBusiness: {
        businessName: {
            type: String,
            requiredLevel: 2
        },
        address: String,
        businessType: {
            type: String,
            requiredLevel: 2
        },
        otherDetails: String,
        ReservationAndRates: String,
        website: {
            type: String,
            requiredLevel: 2
        }
    }
};
