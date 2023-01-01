const jwt=require('jsonwebtoken')
const userAuth=(req,res,next)=>{
    const token=req.headers["x-auth-token"]
    if(!token){
        return res.status(400).send({status:false,message:"You are not logged in"})
    }

    jwt.verify(token,"secret",(err,payload)=>{
        if(err){
           return  res.status(403).send({status:false,message:err.message})
        }
        else{
            if(payload.userType!='user'){
                return  res.status(403).send({status:false,message:"Not accessible to admin"})
            }
            req.user=payload
            next()
        }
    })
    
}

module.exports=userAuth