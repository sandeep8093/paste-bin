require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const pastesRouter =require('./routers/pastes.js');


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log("MongoDB Error:", error));

mongoose.connection.on('connected', function () {  
  console.log('Mongodb Connected');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.json());
app.use(cors());

app.use('/', pastesRouter);
app.use('/auth', require('./routers/users'));

if(process.env.NODE_ENV === "production"){
app.use(express.static("client/build"));
const path=require("path");
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,'client','build','index.html'))
})

}

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});
