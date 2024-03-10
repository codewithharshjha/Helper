const mongoose=require("mongoose")

exports.connectodatabase=()=>{
uri="mongodb://localhost:27017/helper"

    mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("database in connected")
    }).catch((error)=>{
        console.log(error.message)
    })
}
