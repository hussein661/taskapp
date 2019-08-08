require('../src/db/mongoose')
const User = require('../src/models/User')
const Task = require('../src/models/Task')

// User.findByIdAndUpdate('5d2dbeca78c13297e8f289cc',{age:23}).then(user=>{
//     console.log(user)
//     return User.countDocuments({age:23})
// }).then(result=>{
//     console.log(result)
// }).catch(error=>{
//     console.log(error)
// })

const updateAgeAndCount = async (id,age)=>{
    const result = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    console.log(result,count)

}




// Task.findByIdAndDelete('5d2ec1a4e15a4b33b4d77b1e').then(task=>{
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then(result=>{
//     console.log(result)
// }).catch(error=>{
//     console.log(error)
// })

