import express from 'express';
import prisma from '@repo/db/client';

const app = express();
app.use(express.json());

app.post("/signin",(req,res)=>{
    const {username,password}=req.body; 
});
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    await prisma.user.create({
        data:  {
            username,
             
        }
    });
});

app.listen(3002);


