const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/EmployeeDB', {useNewUrlParser: true}, (err) => {
    if(!err) {console.log('MongoDB connection OK')}
    else {console.log('Error connection : ' + err)}
});

require('./employee.model');