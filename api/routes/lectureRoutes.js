'use strict';

module.exports = (app) => {
    var lectures = require('../controllers/lectureController');

    app.route('/lectures')
        .get(lectures.get_lectures)
        .post(lectures.add_a_lecture);
    
    
    app.route('/lectures/:lectureId')
        .get(lectures.read_a_lecture)
        .put(lectures.update_a_lecture)
        .delete(lectures.delete_a_lecture);
}