const jwt=require('jsonwebtoken')
const bookingModel=require('../models/bookingModel')
const userModel=require('../models/userModel')

const testAdminController=(req,res)=>{
    console.log(req.body)
    res.send({status:"Hello from admin controller of vaccination app"})
}

//VIEW ALL SLOTS FOR A GIVEN DATE
const viewAllSlots=async(req,res)=>{
    let date=req.query.date;
    date=new Date(date)
    const allSlots=await bookingModel.find({Day:date}).populate('User','Name')
    res.status(200).send({status:true,allBookings:allSlots})
}

//VIEW ALL USERS (FILTERS)
const viewAllUsers=async(req,res)=>{
    
    const filter=req.query
    
    const allUsers=await userModel.find(filter)
    res.status(200).send({status:true,users:allUsers})
}

//ADMIN LOGIN
const login = async (req, res) => {
    const isUserAvailable = await userModel.findOne(req.body);
    if (!isUserAvailable) {
      return res
        .status(400)
        .send({ status: false, message: "Admin not registered" });
    }
    const token = jwt.sign(
      {
        userType: isUserAvailable.Type,
        userId: isUserAvailable._id,
      },
      "secret",
      {
        expiresIn: "30m",
      }
    );
    return res.status(200).send({ status: true, Token: token });
  };

module.exports={testAdminController,viewAllSlots,viewAllUsers,login}