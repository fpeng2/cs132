// TODO: your code goes here
console.log(process.argv);
if (process.argv.length < 3) {
    console.log ("Please specify command!")
} else {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var db = mongoose.connection;

    var CDSchema = new Schema({
        diskid: String,
        title: String,
        artist: String,
        length: Number,
        genre: String,
        year: Number,
        tracks: [{
            name: String,
            artist: String,
            length: Number,
            number: Number,
            offset: Number
        }]
    });

    var CD = mongoose.model('cd', CDSchema);

    db.on('error', console.error); // log any errors that occur



// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
    process.on('SIGINT', function () {
        db.close(function () {
            console.log('DB connection closed by Node process ending');
            process.exit(0);
        });
    });

// the user, password, and url values will be explained next
    //var url = "mongodb://bdognom.cs.brown.edu/cdquery"; // 1%:
    var url = "mongodb://bdognom.cs.brown.edu/cdquery1"; // 1%
    var options = {
        user: 'cs132',
        pass: 'csci1320',
        useMongoClient: true  // due to version issues, this is necessary to avoid warnings
    };


    if (process.argv[2] == "related") {
        // bind a function to perform when the database has been opened
        db.once('open', function () {
            // perform any queries here, more on this later

            console.log("Connected to DB!");

            var query = CD.find({'tracks.artist': 'Taylor Swift'}).and({'tracks.artist': 'Beyonce'});
            var p = queryListNotEmpty(query);
            var returnval;
            p.then(function(result) {
                returnval = result;
                console.log("promise got result:" + result);



                db.close(function () {
                    console.log("program exiting");
                })
            }).catch(function(err) {
                console.log(err);



                db.close(function () {
                    console.log("program exiting");
                })
            })
            //console.log(returnval);
        });


        mongoose.Promise = Promise; // use an updated promise library
        mongoose.connect(url, options); // unlike the prelab we are passing in some options
        function queryListNotEmpty(query) {
            var p = new Promise (function (resolve, reject){
                query.exec(function(err, data) {
                    if (err) {
                        return reject(err);
                    }
                    var result;
                    if (data.length > 0) {
                        result = true;
                        console.log(true);
                    }else {
                        console.log(false);
                        result = false;
                    }
                    resolve(result);
                })
            })
            return p;
        }
        function listcallback(err, data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                console.log(true);
            };
            if (data.length <= 0) {
                console.log(false);
            }
        }

    }

}