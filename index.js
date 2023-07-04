//starts

//requiring
const express = require('express');

const mongoose=require('mongoose');

const cors=require('cors');

const cookieParser=require('cookie-parser');

let multer  = require('multer')

const path=require('path')


//app
const app = express();

//app using
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
// app.use(express.static(path.join(__dirname,'public/user_images')));
app.use('/public/user_images', express.static('public/user_images'));
//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/angular2",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => {
    console.log('connection sucsessful')
    app.listen(5000,()=>{
        console.log("app is listening 5000 port");
    })
  }).catch((error) => {
    console.log('somthing wrong', error)
  })  

  const userRoute=require('./routes/uRoute');
   app.use("/",userRoute); 

   const adminRoute=require('./routes/aRouter');
   app.use("/admin",adminRoute); 