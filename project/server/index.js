const express = require('express')
const uuid = require('uuid/v4');
const cors = require('cors')
const bodyParser = require('body-parser')
const { check, body ,validationResult } = require('express-validator/check');
const dynamo = require('./dynamo.js')

const User = require('./Models/User.js')

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

dynamo.createTables(function(err) {
    if (err) {
        console.log('Error creating tables: ', err);
        process.exit()
    } else {
        console.log('Tables has been created');
    }
});


//Middle Ware
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.send("Home Page")
    
})


// })
// app.get('/test', (req,res)=>{
//     User.create({username: "test", password: "idk", email:"test@gmail.com"}, (err, user)=>{
//         if(err)
//             console.log(err);
//         else
//             console.log(`Created ${user}`);
//         res.end()
//     })
// })

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

const formValidationChain = [
    check('username', 'Please enter a username between 5-12 characters').exists({checkFalsy: true}),
    check('password', 'Please enter a password').exists({checkFalsy:true}),
    
    (req,res,next)=>{
        errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json(errors.array().map((err)=> err.msg));
        }
        else
            next()
    }
    
]

app.post('/create-account', formValidationChain, (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    User.create({id : uuid(), username, password, email}, (err,user)=>{
        if(err){
            res.status(400).send(err)
        }
        else if(!user){
            res.status(400).send()
        }
        else{
            res.status(200).json(user)
        }
    })
    
})

