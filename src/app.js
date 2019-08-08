const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
const multer = require('multer')
require("./db/mongoose");

const upload = multer({
  dest:'images'
})

app.post('/upload',upload.single('upload'),(req,res)=>{
  
  res.send()
})

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
  console.log("server is running on port " + port);
});


const Task = require('./models/Task')
const User = require('./models/User')

