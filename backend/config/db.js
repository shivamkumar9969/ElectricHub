const mongoose = require("mongoose")


async function connectDB(){
    try{
        console.log("#########################conecting#####################");
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB