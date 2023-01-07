const e = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db')




register = (fullname, designation, monthlyIncome, currentBalance, amountToSave, username, password, appRegisteredMonth) => {
    return db.User.findOne({ username })
        .then((user) => {
            if (user) {
                return {
                    status: false,
                    statusCode: 400,
                    message: 'user already registered'
                }
            } else {
                const newUser = db.User({
                    fullname,
                    designation,
                    monthlyIncome,
                    currentBalance,
                    amountToSave,
                    username,
                    password,
                    appRegisteredMonth
                    // transactions: [],
                    // balance: []
                });
                newUser.save();
                return {
                    status: true,
                    statusCode: 200,
                    message: 'user register successfully'
                }
            }
        })
}


login = (username, password) => {
    return db.User.findOne({ username })
        .then(user => {
            if (user) {
                if (user.password == password) {
                    token = jwt.sign({
                        username: username
                    }, 'budgettracking');
                    currentUser = user.fullname;
                    this.currentUsername = username;
                    return {
                        status: true,
                        statusCode: 200,
                        message: 'login successfully',
                        token: token,
                        currentUser: currentUser,
                        currentUsername: username,
                        balance: user.currentBalance,
                        appRegisteredMonth: user.appRegisteredMonth
                    }
                } else {
                    return {
                        status: false,
                        statusCode: 400,
                        message: 'login failed...invalid password'
                    }
                }
            } else {
                return {
                    status: false,
                    statusCode: 400,
                    message: 'login failed...user not registered..'
                }
            }
        })
}


addTransaction = (username, type, category, amount, date, note, month) => {
    return db.User.findOne({ username })
        .then(user => {
            if (user) {
                user.transactions.push({
                    type: type,
                    category: category,
                    amount: amount,
                    date: date,
                    note: note,
                });

                if (type == 'credit') {
                    user.currentBalance += Number(amount);
                } if (type == 'debit') {
                    user.currentBalance -= Number(amount);
                }
                user.balance.push({
                    type: type,
                    category: category,
                    amount: amount,
                    date: date,
                    bal: user.currentBalance,
                    id: Math.floor(Math.random() * 10000000000)
                });
                user.transacttionPerMonth[month].push({
                    type: type,
                    category: category,
                    amount: amount,
                    date: date,
                    bal: user.currentBalance,
                    id: Math.floor(Math.random() * 10000000000)
                })
                user.save();
                return {
                    statusCode: 200,
                    status: true,
                    message: 'transactions added successfully',
                    transactions: user.transactions,
                    balanceArray: user.balance
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: 'failed to add transactions  ...invalid user'
                };
            }
        })


}


getTransaction = (username) => {
    return db.User.findOne({ username })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    transactionsArray: user.transactions,
                    balanceArray: user.balance,
                    transacttionPerMonth: user.transacttionPerMonth
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: 'failed to load data...invalid user'
                };
            }
        })

}

deleteRow = (username) => {

    return db.User.findOne({ username })
        .then((user) => {
            if (user) {
                let perMonthArray = user.transacttionPerMonth;
                let balanceArray = user.balance;
                if (balanceArray.length != 0) {
                    transactionsArray = user.transactions;
                    bpopped = balanceArray[balanceArray.length - 1];
                    poppedDate = bpopped.date;
                    date = new Date(poppedDate);
                    month = date.getMonth() + 1;
                    perMonthArray[month].pop()
                    tpopped = transactionsArray[transactionsArray.length - 1];
                    if (tpopped.type == 'credit') {
                        user.currentBalance -= Number(tpopped.amount);
                        balanceArray.pop()
                        transactionsArray.pop()

                    } else if (tpopped.type == 'debit') {
                        user.currentBalance += Number(tpopped.amount);
                        balanceArray.pop()
                        transactionsArray.pop()

                    }
                    user.save();
                    return {
                        status: true,
                        statusCode: 200,
                        array: balanceArray,
                        transactionsArray: transactionsArray,
                        message: 'your last trnsaction is deleted successsfully'
                    }
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: 'nothing to delete..please add transactions '
                    };
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: 'failed to delete data...invalid user'
                };
            }
        })
}

getLastMonthDetails = (username) => {
    return db.User.findOne(username)
        .then(user => {
            if (user) {
                return {
                    status: true,
                    statusCode: 200,
                    transacttionPerMonth: user.transacttionPerMonth

                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: 'failed to delete data...invalid user'
                };
            }
        })
}



module.exports = {
    register,
    login,
    addTransaction,
    getTransaction,
    deleteRow,
    getLastMonthDetails
}