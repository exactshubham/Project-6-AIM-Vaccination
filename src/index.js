const express= require('express');
const mongoose= require('mongoose');
const app= express();

const userRoutes=require('./router/userRoutes')
const adminRoutes=require('./router/adminRoutes')

app.use(express.json());

app.use(userRoutes)
app.use(adminRoutes)

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://ShubhamChaturvedi:9555047172@mongodbwithshubham.z3dowao.mongodb.net/test",{useNewUrlParser:true})
.then(()=>console.log("MongoDb is connected!"))
.catch((error)=>console.log(error.message))



app.listen(process.env.PORT ||  3000, () =>{
    console.log("Express app running on PORT " + (3000 || process.env.PORT))
})