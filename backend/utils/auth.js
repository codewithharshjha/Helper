const User=require("../models/Usermodels")
const jwt=require("jsonwebtoken")
const JWT_SECRET="harshjhaekchutiyainsaanhai"
exports.isAuthenticated=async(req,res,next)=>{
    try {
        const {token}=req.cookies
      if(!token){
        return res.status(401).json({
            message:"please login first"
        })
      }
      const decoded=await jwt.verify(token,JWT_SECRET)
      req.user=await User.findById(decoded._id)
      next()
    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}