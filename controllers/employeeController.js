const express = require('express');

var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "insert employess"
    });
});

router.post('/', (req, res) => {
  // console.log(req.body);
  if(req.body._id == '')
   insertReccord(req, res); 
   else
   updateReccord(req,res);
});

function insertReccord(req, res){
     var employee = new Employee();
     employee.fullName = req.body.fullName;
     employee.email = req.body.email;
     employee.mobile = req.body.mobile;
     employee.city = req.body.city;
     employee.save((err, doc) => {
         if(!err)
            res.redirect('employee/list');
            else{
                if(err.name == 'ValidationError'){
                    hundleValidationError(err, req.body);
                    res.render("employee/addOrEdit", {
                        viewTitle: "insert employess",
                        employee: req.body
                    });
                }
              else
                console.log('Error during reccord insertion' + err);
            }
     });
}

function updateReccord(req, res){
    Employee.findOneAndUpdate({
         _id: req.body._id
    }, req.body, {new: true},(err, doc) => {
        if(!err){res.redirect('employee/list');}
        else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }else
            console.log('Error during record update: '+err);
        }
    });
}


router.get('/list', (req, res) => {
 // res.json('from list'); 
  Employee.find((err, docs) => {
      if(!err) {
          res.render("employee/list", {
              list: docs
          });
      }
      else{
          console.log('Error in retreving employee list:' + err);
      }
  }); 
});

function hundleValidationError(err, body){
   for(field in err.errors){
      switch(err.errors[field].path){
          case 'fullName':
           body['fullNameError'] = err.errors[field].message;
           break;
           case 'email':
           body['emailError'] = err.errors[field].message;
           break;
           case 'mobile':
           body['mobileError'] = err.errors[field].message;
           break;
           case 'city':
           body['cityError'] = err.errors[field].message;
           break;
      } 
   } 
};

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete: ' + err);}
    });
});
module.exports = router;