'use strict';

module.exports = (app) => {
    var studentList = require('../controllers/studentController');

    app.route('/students')
        .get(studentList.list_all_students)
        .post(studentList.add_a_student);
    
    
    app.route('/students/:studentId')
        .get(studentList.read_a_student)
        .put(studentList.update_a_student)
        .delete(studentList.delete_a_student);

    app.route('/my/enrollments')
        .get(studentList.get_enrollments);
}
