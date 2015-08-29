// requiredLevel -
//    1 = medium priority
//    2 = high priority

module.exports = {
  Attendee: {
    Experience: String,
    Title: {
      type: String,
      requiredLevel: 1
    },
    Name: {
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
    Session: {
      type: String,
      requiredLevel: 2
    },
    ImageFileName: String
  },
  Session: {
    Track: {
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
    Talk: {
      type: String,
      requiredLevel: 2
    },
    Track: {
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
    Name: {
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
    }
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
 /* TravelBusiness: {
    businessName: {
      type: String,
      requiredLevel: 2
    },
    businessType: {
      type: String,
      requiredLevel: 2
    }
  }*/
};
