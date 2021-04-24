'use strict';

module.exports = (app) => {
    var teacherList = require('../controllers/teacherController');

    app.route('/teachers')
        .get(teacherList.list_all_teachers)
        .post(teacherList.add_a_teacher);
    
    
    app.route('/students/:studentId')
        .get(teacherList.read_a_teacher)
        .put(teacherList.update_a_teacher)
        .delete(teacherList.delete_a_teacher);
}