const express = require('express')
const cors = require('cors')
const connection = require('./db')
const bodyParser = require('body-parser')
const { check, body ,validationResult } = require('express-validator/check');
const db = require('./db')
const User = require('./Models/User')
const config = require('./config')
const jwt = require('jsonwebtoken')

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

    User.verify("Shelly", "5")
    res.send("Home Page")
    
})

app.get('/test', (req,res)=>{
    User.find("fds", (err, user)=>{
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

    User.create(username, raw_password, (err, token)=>{
        if(err)
            res.status(400).json(["Failed to create account"])
        else
            res.status(200).json(token)      
    })
})

app.post('/login-account', (req,res)=>{
    const username = req.body.username
    const raw_password = req.body.password

    User.verify(username, raw_password, (err, token)=>{
        if(err)
            console.log(err);
        else if(!token){ //Verification is false. No Token
            //React Native Form renders an array of error strings
            const errors = ["Incorrect username and or password"]
            res.status(400).json(errors)
        }
        else //Verification Success. Token Generated
            res.status(200).json(token)
    })   
})

app.get('/get-user-data', (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, config.jwt.secret)
    console.log("payload", payload);

    User.findById(payload.id, (err, user)=>{
        if(err || !user)
            res.status(400).end()
        else
            res.status(200).json({username: user.username})
    })

    
})





