const express = require('express')
const cors = require('cors')
const connection = require('./db')
const bodyParser = require('body-parser')
const { check, body ,validationResult } = require('express-validator/check');
const db = require('./db')
const User = require('./Models/User')

const app = express()
const DEFAULT_PORT = 3000
app.listen(process.env.PORT || DEFAULT_PORT, (err)=>{
    if(err){
        console.log(err);
        process.exit()
    }
    else
        console.log(`Server is now listening to port ${process.env.PORT || DEFAULT_PORT}`);
});

app.use(cors())


//Middle Ware
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    db.query(`SELECT * FROM user`, (err, results, fields)=>{
        console.log("USER TABLE", results);
    })
    res.send("Home Page")
    
})

app.get('/test', (req,res)=>{
    User.find("ad", (err, user)=>{
        if(err)
            console.log(`Error with finding ${ad}`, err);
        else
            console.log("SEARCH RESULT", user);
    })
})


// app.get('/test-update', (req,res)=>{
//     User.update({username: "test", email:"test2@gmail.com"}, (err,user)=>{
//         if(err)
//             console.log(err);
//         else
//             console.log(`Updated to ${user.toString()} `);
//         res.end()
//     })
// })


// app.get('/test-delete', (req,res)=>{
//     User.destroy("test", (err)=>{
//         if(err)
//             console.log(err);
//         else
//             console.log("Successfully destroyed");
//         res.end()
//     } )
// })

// const formValidationChain = [
//     check('username', 'Please enter a username between 5-12 characters').exists({checkFalsy: true}),
//     check('password', 'Please enter a password').exists({checkFalsy:true}),
    
//     (req,res,next)=>{
//         errors = validationResult(req)
//         if(!errors.isEmpty()){
//             res.status(400).json(errors.array().map((err)=> err.msg));
//         }
//         else
//             next()
//     }
    
// ]

app.post('/create-account', (req,res)=>{
    const username = req.body.username
    const raw_password = req.body.password
    const email = req.body.email

    User.create(username, raw_password, (err)=>{
        if(err)
            console.log(err);
        else
            console.log(`Successfully created user ${username}`);
    })
    
    res.status(200).end()
})

app.post('/login-account', (req,res)=>{
    const username = req.body.username
    const raw_password = req.body.password

    User.verify(username, raw_password, (err, isValid)=>{
        if(err)
            console.log(err);
        else if(isValid === true){
            res.status(200).end()
        }
        else{ //Res is false
            //React Native forms need errors in array form
            const errors = ["Incorrect username and or password"]
            res.status(400).json(errors)
        }
    })   
})





