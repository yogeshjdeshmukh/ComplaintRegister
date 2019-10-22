const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const ComplaintSchema = new Schema({
    firstname :{
        type: String,
        required : [true, 'First Name is Required']
    },
    lastname :{
        type: String,
    },
    roll :{
        type : String,
        required : [true, 'Roll Number is Required']
    },
    email :{
        type: String,
        required : [true, 'Email ID is Required']
    },
    phone :{
        type: String,
        required : [true, 'Contact is Required']
    },
    hname :{
        type: String,
        required : [true, 'Please tell us your hostel']
    },
    room :{
        type: String,
        required : [true, 'Room Number is required']
    },
    comp :{
        type: String,
        required : [true, 'Fill the Complaint']
    },
    date :{
        type : Date,
        default : Date.now
    },
    status :{
        type : Boolean,
        default :false
    }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;