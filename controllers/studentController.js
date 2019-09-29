const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Student = mongoose.model('Student');

router.get('/', (req, res) => {
    Student.find((err, docs) => {
        if (!err) {
            res.render("student/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving student list :' + err);
        }
    });
});

router.get('/addStudent', (req, res) => {
    res.render("student/addOrEdit", {
        viewTitle: "Insert Student"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var student = new Student();
    student.studentId = req.body.studentId;
    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;
    student.address = req.body.address;
    student.dayOfBirth = req.body.dayOfBirth;
    student.save((err, doc) => {
        if (!err)
            res.redirect('/');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addOrEdit", {
                    viewTitle: "Insert student",
                    student: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Student.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addOrEdit", {
                    viewTitle: 'Update student',
                    student: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Student.find((err, docs) => {
        if (!err) {
            res.render("student/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving student list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Student.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("student/addOrEdit", {
                viewTitle: "Update student",
                student: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Student.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else { console.log('Error in student delete :' + err); }
    });
});

module.exports = router;
