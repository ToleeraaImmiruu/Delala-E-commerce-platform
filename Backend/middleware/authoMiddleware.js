 import jwt from "jsonwebtoken"

 const verifyToke= (req,res,next)=>{

   let token;
   let authHeader = req.headers.Authorization || req.headers.authorization;
   if (authHeader && authHeader.startsWith('Bearer')) {
     token = authHeader.split(" ")[1];
     if (!token) {
       return res 
         .status(401)
       .json({message:"no token , we need the authorization admin"})
     }
     try {
       const decode=jwt.verify(token,process.env.JWT_SECRET)
       req.user=decode;
       console.log("the decoded user :", req.user);
        next();
     } catch(err) {
       res.status(400)
       .json({message:"token is not valid "})
     }
   } else {
      return res 
         .status(401)
       .json({message:"no token , we need the authorization admin"})
      }
}
export default verifyToke;