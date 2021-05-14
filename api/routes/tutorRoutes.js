'use strict';

module.exports = (app) => {
    var tutorList = require('../controllers/tutorController');

    app.route('/tutors')
        .post(tutorList.add_a_tutor);
    
    app.route('/tutors/lectures')
        .get(tutorList.lectures_created_by_tutor);
    
    app.route('/tutors/lectures/:lectureId')
        .delete(tutorList.delete_lecture);
    
    app.route('/tutors/:tutorId')
        .get(tutorList.read_a_tutor)
        .put(tutorList.update_a_tutor)
        .delete(tutorList.delete_a_tutor);
}