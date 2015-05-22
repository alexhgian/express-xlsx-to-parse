
var fakeRes = {
    sendStatus : function(status) {
        console.log(status);
    }
}

//fileToParse();
function fileToParse(req, res, next){
    res = res || fakeRes;
    if(req){
        conference.id = req.body.conference;
    } else {
        conference.id = 'yVEOkRMQ5w';
    }

    var list = [];
    var promises = [];
    var sheet = [{
        'name' : 'Wellness Matters',
        'speakers' : 'Deepak Chopra, Gary Conkright',
        'description' : 'Being Well in the 33rd century',
        'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
        'conference': 'x9e1mtYnwH',
        'session': 'Morning Session One',
        'date':'10/17/1991',
        'startTime':'9:59 AM',
        'endTime':'10:59 AM'
    },{
        'name' : 'Robots Matters',
        'speakers' : 'Gary Conkright',

        'description' : 'Arduino Microcontrollers',
        'slideName' : '2eb01cc0-8ebb-451f-855a-52008979a5de/tfss-4f405416-a80b-41a9-bbec-f468a6141666-cat1.jpeg',
        'conference': 'x9e1mtYnwH',
        'session': 'Morning Session One',
        'date':'11/20/2039',
        'startTime':'9:59 AM',
        'endTime':'10:59 AM'
    }];

    var p1 = Mapper(conference, sheet, 'Event', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved P1");
        //console.log(data);
    });
    var p2 = Mapper(conference, sheet, 'Event', function(data, err){
        if(err) {return console.log("Error");}
        console.log("Success Saved P2");
        //console.log(data);
    });

    Parse.Promise.when([p1,p2]).then(function(data,err){
        console.log('Finished');
    });

}
