const mongoose = require("mongoose")

exports.connectDB = async () =>{
    try{
    await mongoose.connect('mongodb+srv://sauno:pirula2498@cluster2.d4nqpwt.mongodb.net/?retryWrites=true&w=majority')
    console.log('mongo conectado')
} catch (error){
    console.log(error)
}
}

 