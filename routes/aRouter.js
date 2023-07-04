const express = require("express");
const aRoute = express();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin=require('../model/admin');

// const upload=require('../middlewares/multer')


aRoute.get('/admin', async (req, res) => {
    const GettingUser = await Admin.findOne({ email:req.body.email })
    if(!GettingUser){
        return res.status(404).send({
            message:"email not Found"
        })
    }
    if(!(req.body.password==GettingUser.password)){
        return res.status(404).send({
            message:"Password is Incorrect"
        })  
    }
    const token = jwt.sign({ _id: GettingUser._id }, "TheSecretKeyofAdmin")
    res.cookie("jwtAdmin", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json({
        message: "success"
    })
}




)

aRoute.get('/active',async (req, res) => {
    try {
         const cookie=req.cookies['jwtAdmin']
         const claims=jwt.verify(cookie,"TheSecretKeyofAdmin")
         if(!claims){
             return res.status(401).send({
                 message:"UnAuthenticated"
             })
         }else{
            const GettingUser = await Admin.findOne({ _id: claims._id })
            const {password,...data}=await GettingUser.toJSON()
            res.send(data)
         }
     } catch (err) {
         return res.status(401).send({
             welcome:"UnAuthenticated" 
         })
     }
})


aRoute.post('/login', async (req, res) => {
    const GettingUser = await Admin.findOne({ email:req.body.email })
    if(!GettingUser){
        return res.status(404).send({
            message:"User not Found"
        })
    }
    if(!(req.body.password==GettingUser.password)){
        return res.status(404).send({
            message:"Password is Incorrect"
        })  
    }
    const token = jwt.sign({ _id: GettingUser._id }, "TheSecretKeyofAdmin")
    res.cookie("jwtAdmin", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json({
        message: "success"
    })
}
)


aRoute.get('/users', async (req, res) => {
    try {
    //    console.log("lodding");
    //     const cookie=req.cookies['jwt']
       
    //     const claims=jwt.verify(cookie,"TheSecretKeyofAdmin")
    //     if(!claims){
    //         console.log("111111111111");
    //         return res.status(401).send({
         
    //             message:"UnAuthenticated"
    //         })
    //     }
        const GettingUser = await User.find({})
        // const {password,...data}=await GettingUser.toJSON()
      
        res.send(GettingUser)
        
    } catch (err) {
        return res.status(401).send({
            welcome:"UnAuthenticated" 
        })
    }
})

aRoute.post('/deleteUser/:id', async (req, res) => {
    try {
        console.log("baaarnn");
      await User.deleteOne({_id:req.params.id})
        const GettingUser = await User.find({})
       
        res.send(GettingUser)
    } catch (err) {
        return res.status(401).send({
            welcome:"UnAuthenticated" 
        })
    }
})


aRoute.post('/editUser', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;

    const check = await User.findOne({ email: email })
    if (check && email!=check.email) {
        return res.status(400).send({
            message: "Email is already registered"
        })
    } else {
        // const user = new User({
        //     name: name,
        //     email: email
        // })
        // const added = await user.save();
        // create jwt token
        // const { _id } = await added.toJSON();
        // const token = jwt.sign({ _id: _id }, "TheSecretKey")
        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000
        // })
        await User.updateOne({ email: email },{$set:{name:name}})
        res.json({
            message: "success"
        })
    }

})


aRoute.post('/editDetails/:id', async (req, res) => {

        try {
            console.log("bsaaa");
        //   await User.deleteOne({_id:req.params.id})
            const GettingUser = await User.findOne({_id:req.params.id})
           console.log(GettingUser);
            res.send(GettingUser)
        } catch (err) {
            return res.status(401).send({
                welcome:"UnAuthenticated" 
            })
        }
    })



    aRoute.post('/createUser', async (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        const check = await User.findOne({ email: email })
        if (check) {
            return res.status(400).send({
                message: "Email is already registered"
            })
        } else {
            const changeP = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, changeP)
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
            const added = await user.save();
            //create jwt token
            // const { _id } = await added.toJSON();
            // const token = jwt.sign({ _id: _id }, "TheSecretKey")
            // res.cookie("jwt", token, {
            //     httpOnly: true,
            //     maxAge: 24 * 60 * 60 * 1000
            // })
            res.json({
                message: "success"
            })
        }
    
    })

  
aRoute.post('/logout', async (req, res) => {
    res.cookie("jwtAdmin","", {
        maxAge:0
    })
    res.send({message:"success"})
}) 
   
module.exports = aRoute;