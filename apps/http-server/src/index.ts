import express from 'express';
import prisma from '@repo/db/client';

const app = express();
app.use(express.json());

app.post("/signin",async (req,res)=>{
    const {username,password}=req.body; 
    try{
        const user= await prisma.user.findFirst({
        where:{
            username,
            
        }
    });

    if(!user || user.password !== password){
        return res.status(401).json({message:"Invalid credentials"});
    }
    }catch(error){
        return res.status(500).json({message:"Internal server error"});

    }
    
    return res.json({message:"Signin successful"});
    
});
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    await prisma.user.create({
        data:  {
            username,
            password
             
        }
    });
    return  res.json({ message: "Signup successful" });
});

app.listen(3002);


