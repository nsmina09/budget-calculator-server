
const express = require('express');
const dataservice = require('./services/dataservices');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
const jwtmiddleware = (req, res, next) => {
    try {
        token = req.headers.token;
        jwt.verify(token, 'budgettracking');
        next();
    } catch {
        res.status(422).json({
            status: false,
            statusCode: 422,
            message: 'please login first'
        })
    }
}
app.listen(3000, () => {

});

app.post('/register', (req, res) => {
    dataservice.register(
        req.body.fullname,
        req.body.designation,
        req.body.monthlyIncome,
        req.body.currentBalance,
        req.body.amountToSave,
        req.body.username,
        req.body.password,
        req.body.appRegisteredMonth)
        .then(result => {
            res.status(result.statusCode).json(result);
        })

})

app.post('/login', (req, res) => {
    result = dataservice.login(
        req.body.username,
        req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result);
        })

})

app.post('/budget', jwtmiddleware, (req, res) => {
    result = dataservice.addTransaction(
        req.body.username,
        req.body.type,
        req.body.category,
        req.body.amount,
        req.body.date,
        req.body.note,
       req.body.month
    ).then(result => {
        res.status(result.statusCode).json(result);
    })
})


app.post('/gettransaction', jwtmiddleware, (req, res) => {
    dataservice.getTransaction(req.body.username)
        .then(result => {
            res.status(result.statusCode).json(result);
        })

})

app.post('/delete-row',(req,res)=>{
    dataservice.deleteRow(req.body.username)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.get('/last-transaction',(req,res)=>{
    dataservice.getLastMonthDetails()
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/update-last',(req,res)=>{
    dataservice.updateLastTransaction(
        req.body.username,
        req.body.type,
        req.body.category,
        req.body.amount,
        req.body.date,
        req.body.note,
       req.body.month
    ).then(result => {
        res.status(result.statusCode).json(result);
    })
})