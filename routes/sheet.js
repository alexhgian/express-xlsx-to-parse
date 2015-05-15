var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var Parse = require('parse').Parse;
/* GET users listing. */
router.get('/', function(req, res, next){
    // // if(typeof require !== 'undefined') XLSX = require('xlsx');
    // Parse.initialize('olCKrLaKEACbv4YLE1UUjRzVzRbAfYoatW8SH4S6','jCoQ3IDnzNm2qmxD2fsZpfpZhMgREWXWdHAVU5fg');
    // // Simple syntax to create a new subclass of Parse.Object.
    // var Attendee = Parse.Object.extend("Attendee");
    //
    // // Create a new instance of that class.
    // var attendee = new Attendee();
    // attendee.set("name", 'alex1234');
    // attendee.save(null, {
    //     success: function(gameScore) {
    //         // Execute any logic that should take place after the object is saved.
    //         console.log('New object created with objectId: ' + gameScore.id);
    //     },
    //     error: function(gameScore, error) {
    //         // Execute any logic that should take place if the save fails.
    //         // error is a Parse.Error with an error code and message.
    //         console.log('Failed to create new object, with error code: ' + error.message);
    //     }
    // });

    res.sendStatus(200);
});

router.post('/api/import/', function(req, res, next) {
    var file = req.files.file
    console.log(req.files);
    if(file){

        var workbook = XLSX.readFile(file.path);
        var first_sheet_name = workbook.SheetNames[1];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        res.json(XLSX.utils.sheet_to_json(worksheet));

    } else {
        res.sendStatus(400);
    }
});





module.exports = router;
