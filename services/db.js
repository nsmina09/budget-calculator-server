

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
    appRegisteredMonth: Date,
    transactions: [],
    balance: [],
    transacttionPerMonth: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
    }
})

module.exports = {
    User,
}