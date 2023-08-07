// Import
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mongoose = require('mongoose')

// setting mongo schema
const User = mongoose.model("User", new mongoose.Schema({
    user: String,
    pass: String
}))

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true })
const db = mongoose.connection
// Catching Error, logging when connected
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// Checking if user and pass is currect
app.get('/check', async(req, res)=>{
    if(!req.query.user || !req.query.pass){
        return res.send("error geting userpass")
    }
    let valid = await checkPass(req.query.user, req.query.pass)
    res.send(valid)
})

// registering new user
app.get('/register', async(req, res)=>{
    if(!req.query.user || !req.query.pass){
        return res.send("couldnot get userpass")
    }
    let exists = await User.find({user: req.query.user})
    if(!exists[0]){savePass(req.query.user, req.query.pass)
    res.send('done')
    }
    else{
        res.send("user already exists")
    }
})

// deleting user entry
app.get("/delete", async(req,res)=>{  //test
    if(!req.query.user || !req.query.pass){return res.send("couldnot get userpass")}
    let validity = checkPass(req.query.user, req.query.pass)
    if(validity){
        let del = await User.deleteMany({user: req.query.user})
    if(del){res.send(del)}
        else{res.send("failed to delete")}}
        else{ res.send('wrong user of pass') }
})

// editing user entry
app.get("/edit", async(req,res)=>{  
    if(!req.query.user || !req.query.pass || !req.query.newpass){ return res.send("couldnot get userpass") }
let result = await checkPass(req.query.user, req.query.pass)
if(result){
await User.deleteMany({user: req.query.user})
let _result = await savePass(req.query.user, req.query.newpass)
_result? res.send('done'): res.send("failed");
}else{
    res.send("failed")
}})

//if not found
app.get('*',(req,res)=>res.send("error location"))
app.listen(6969, ()=>{
    console.log("listening on port 6969")
})

 async function savePass(user, pass) {
const hashedPass = await bcrypt.hash(pass,10)
const _user = new User({
    user: user,
    pass: hashedPass
})
await _user.save()
return true
}
 async function checkPass(user, pass) {
   let search = await User.find({user: user})
    if(!search[0]) {
        return false
   }
let _result = bcrypt.compare(pass, search[0].pass)
return _result
}