const mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    MSKH: String,
    Name: String,
    urlImg: String,
    Information: String    
} , { collection: 'Customer' } );

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;