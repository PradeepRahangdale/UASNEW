import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';


var checkUserAuth = async (req, res, next)=>{
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
               //get token from header
               token = authorization.split(' ')[1]
                console.log("Token", token)
                 console.log("Authorizatio", authorization)

               //verify token
               const { userId } = jwt.verify(token,process.env.JWT_SECRET_KEY)

               //get User from token 
               req.user = await UserModel.findById(userId).select('-password')
               next()
        } catch (error) {  
            console.log(error);
            req.status(401).send({"status":"failed", "message":"Unauthorized User"})
            
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"unauthorized user, no token"})
    }
} 
 
export default checkUserAuth