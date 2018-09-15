const express = require('express')
const bodyParser = require('body-parser')
const dynamo = require('./dynamo.js')

const User = require('./Models/User.js')

const app = express()
const DEFAULT_PORT = 3000
app.listen(process.env.PORT || DEFAULT_PORT, (err)=>{
    if(err)
        console.log(err);
    else
        console.log(`Server is now listening to port ${process.env.PORT || DEFAULT_PORT}`);
});


//Middle Ware
app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.send("Home Page")
})

app.get('/create-tables', (req,res)=>{
    dynamo.createTables(function(err) {
        if (err) {
          console.log('Error creating tables: ', err);
        } else {
          console.log('Tables has been created');
        }
      });

})
app.get('/test', (req,res)=>{
    User.create({username: "test", password: "idk", email:"test@gmail.com"}, (err, user)=>{
        if(err)
            console.log(err);
        else
            console.log(`Created ${user}`);
        res.end()
    })
})

app.get('/test-update', (req,res)=>{
    User.update({username: "test", email:"test2@gmail.com"}, (err,user)=>{
        if(err)
            console.log(err);
        else
            console.log(`Updated to ${user.toString()} `);
        res.end()
    })
})


app.get('/test-delete', (req,res)=>{
    User.destroy("test", (err)=>{
        if(err)
            console.log(err);
        else
            console.log("Successfully destroyed");
        res.end()
    } )
})
app.post('create-account', (req,res)=>{
    const username = req.body.username
    const password = req.body.password
})

