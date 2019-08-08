const mongoose = require('mongoose')
const validator = require('validator')

const connectionURL = "mongodb://localhost:27017";
const TaskManagerApi = "task-manager";

mongoose.connect(connectionURL+'/'+TaskManagerApi,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})


