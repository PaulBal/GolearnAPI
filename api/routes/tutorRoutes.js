'use strict';

module.exports = (app) => {
    var tutorList = require('../controllers/tutorController');

    app.route('/tutors')
        .get(tutorList.list_all_tutors)
        .post(tutorList.add_a_tutor);
    
    
    app.route('/tutors/:tutorId')
        .get(tutorList.read_a_tutor)
        .put(tutorList.update_a_tutor)
        .delete(tutorList.delete_a_tutor);
}