const mongoose=require('mongoose');

mongoose.connect(process.env.DB_MONGGO)
.catch((err)=>{
    console.log("Failed connection");
    console.log(err);
})

module.exports={mongoose};