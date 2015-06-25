var mongoose = require('mongoose');
var UserController = {}

var convertToReadableFormat = function(timeout) {
    if (timeout == 0) return 0;
    seconds = timeout % 60;
    minutes = parseInt(timeout / 60);
    time = minutes == 0 ? String(seconds) + " seconds" : String(minutes) + " minutes and " + String(seconds) + " seconds";
    return time;
}
UserController.getPuzzleStatus = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            res.status(500).send(err);
        } else if (!user) {
            res.status(404).send({'error': 'This user does not exist.'});
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err) {
                    res.status(500).send(err);
                } else if (puzzleParts.length != 0){
                    puzzleParts[puzzleParts.length-1].getTimeout(function(err, timeout){
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            puzzleParts[puzzleParts.length-1].timeout = convertToReadableFormat(timeout);
                            res.render('main', { puzzleParts: puzzleParts,
                                        currentUser: req.user.githubUsername,
                                        done: req.user.completionTime });
                        }
                    });
                } else {
                    res.render('main', { puzzleParts: [],
                                        currentUser: req.user.githubUsername,
                                        done: false });
                }
            });
        }
    });
}



module.exports = UserController;