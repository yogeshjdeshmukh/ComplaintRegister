var express = require('express');
var router = express.Router();
var Complaint = require('../models/db');
var Admin = require('../models/admin');
var Student = require('../models/student');


//Main Page
router.get('/', function(req, res, next){
    res.render('html');
});

//Admin Page for Hostels
router.get('/admin', function(req, res, next){
    res.render('admin');
});

//Log in ADMIN
router.post('/admin', function(req, res, next){
    Admin.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong username or password.');
          err.status = 401;
          return next(err);
        } 
        else{
            if(user.length == 0){
                var err = new Error('No Such Admin');
                err.status = 400;
                return next(err);
            }else{
                Complaint.find({hname : req.body.username}).sort({date: -1}).exec(function(error, data){
                    res.render('admincomp', {data: data})
                })
            }
        }
    });
});

router.post('/admin/:id', function(req, res, next){
    console.log(req.params)
    console.log(req.body._id)
    Complaint.findByIdAndUpdate({_id: req.params.id},{$set : {status: true}}, function(err, result){
        console.log("Complaint Solved")
        res.json({success:true});
    })
})



//Student Complaint Page
router.get('/student', function(req, res, next){
    res.render('studentlogin');
});


router.post('/student', function(req, res, next){
    Student.authenticate(req.body.roll, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong rollno or password.');
          err.status = 401;
          return next(err);
        } else {
            url = 'complaint' + '?userId=' + user._id;
            console.log(url);
          return res.redirect(url);
        }
      }); 
});

router.get('/complaint', function(req, res, next){
    Student.findById(req.query.userId)
    .exec(function(error, user){
        if(error){
            return next(error);
        }
        else{
            if(user === null){
                var err = new Error('Hmmm Fake login');
                err.status = 400;
                return next(err);
            }else{
                res.render('student', {user : user});
            }
        }
    });
});

//Adding student to the database
router.post('/complaint/:id', function(req, res, next){
    Student.findById(req.params.id)
    .exec(function(error, user){
        if(error){
            return next(error);
        }
        else{
            console.log(user);
            var Data = {
                firstname : user.firstname,
                lastname : user.lastname,
                roll : user.roll,
                email : user.email,
                phone : user.phone,
                hname : req.body.hname,
                room : req.body.room,
                comp : req.body.comp
            }
            Complaint.create(Data, function(error, data){
                if(error){
                return next(error);
                }else {
                    res.redirect('/student');
                }
            });
        }
    });
    
});


//Get all Complaints
router.get('/names', function(req, res){
    Complaint.find({}, function(err, data){
        res.send(data);
    })
})

//Dashboard for students
router.get('/dash', function(req, res, next){
    res.render('dash');
});


//Show all the complaints based on query
router.post('/dash', function(req, res, next){
    Complaint.find({roll : req.body.roll}).sort({date: -1}).exec(function(error, data){
        /*if(!data){
            res.send('<h1>No Such User</h1>');
        }
        else{
            res.send(data);
        }*/
        res.render('status', {data: data})
    });
});

//Delete all Complaints Danger Zone Comment it out

router.get('/delete', function(req, res, next){
    // if(err)
    // {
    //     return next(err);
    // }
    // else
    // {
    Complaint.remove({}, function(err)
    {
        if (err) 
        {
            console.log(err)
        }
        res.send("Delete Done");
    })
    // }
})

router.get('/deletestudent', function(req, res, next){
    // if(err)
    // {
    //     return next(err);
    // }
    // else
    // {
    Student.remove({}, function(err)
    {
        if (err) 
        {
            console.log(err)
        }
        res.send("Delete Done");
    })
    // }
})


//page for adding admin
router.get("/addadmin", function(req, res, next){
    res.render('index');
})
 router.post("/addadmin", function(req, res, next){
     var Data = {
         username : req.body.username,
         password : req.body.password
     }
     Admin.create(Data, function(error, data){
        if(error){
        return next(error);
        }else {
            res.send('<h1>Admin sent Successfully</h1>');
        }
    });
 })


 router.get("/addstudent", function(req, res, next){
    res.render('addstud');
})


router.post("/addstudent", function(req, res, next){
        var Data = {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            roll : req.body.roll,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password
        }
        console.log(Data);
        Student.create(Data, function(error, data){
            if(error){
            return next(error);
            }else {
                res.redirect('/');
            }
        });
})


module.exports = router;