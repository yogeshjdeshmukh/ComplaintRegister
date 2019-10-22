const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const AdminSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

AdminSchema.statics.authenticate = function(username, password, callback){
    Admin.findOne({username: username})
    .exec(function(err, admin){
        if(err){
            return callback(err)
        }else if(!admin){
            var err = new Error('User Not Found');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, admin.password, function(err, result){
            if(result === true){
                return callback(null, admin);
            } else {
                return callback();
            }
        })
    });
}


AdminSchema.pre('save', function (next) {
    var admin = this;
    bcrypt.hash(admin.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      admin.password = hash;
      next();
    })
  });

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;