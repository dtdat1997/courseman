const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        required: true
    },
    firstName: String,
    lastName: String,
    address: String,
    dayOfBirth: Date,
});

mongoose.model('Student', studentSchema);