

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/budgettracker',
    {
        useNewUrlParser: true
    }
);
const User = mongoose.model('User', {
    fullname: String,
    designation: String,
    monthlyIncome: Number,
    currentBalance: Number,
    amountToSave: Number,
    username: String,
    password: String,
    transactions: [],
    balance: []
})

module.exports = {
    User,
}