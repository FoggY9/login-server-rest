
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
let data = []
//set port

app.get('/', async(req, res)=>{
    if(!req.query.user || !req.query.pass){
        return res.send("error geting userpass")
    }
    let valid = await checkPass(req.query.user, req.query.pass)
    res.send(valid)
})
app.post('/', (req, res)=>{

    if(!req.query.user || !req.query.pass){
        return res.send("couldnot get userpass")
    }

    savePass(req.query.user, req.query.pass)
    res.send("done")
})

app.listen(6969, ()=>{
    console.log("listening")
})

async function savePass(user, pass) {

const hashedPass = await bcrypt.hash(pass,10)
data.push({user : user, pass : hashedPass})
console.log(data)
}
 function checkPass(user, pass) {
    for(let elem of data){
        if(elem.user == user){
           return bcrypt.compare(pass, elem.pass)
            
        }
    }
    
        console.log('bull')
        return "account doesn't exists"
}
function deleteReg() {
    
}