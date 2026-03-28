import express from 'express';
import prisma from '@repo/db/client';

const app = express();
app.use(express.json());

app.post("/signin", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.json({ 
            message: "Signin successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/signup", async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name
            }
        });

        return res.status(201).json({ 
            message: "Signup successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/events", async (req, res) => {
    const { title, location, eventDate, totalSeats } = req.body;
    if (!title || !location || !eventDate || !totalSeats) {
        return res.status(400).json({ message: "All event details are required" });
    }
    

    const totalSeatsNum = Number(totalSeats);
    try{
        const event = await prisma.event.create({
            data: {
                title,
                location,
                eventDate: new Date(eventDate),
                totalSeats: totalSeatsNum
                
            }
        });
        return res.status(201).json({
            message: "Event created successfully",
            event: {
                id: event.id,
                title: event.title,
                location: event.location,
                eventDate: event.eventDate,
                totalSeats: event.totalSeats,
                
            }
        });



    }catch(error){
        return res.status(500).json({ error });
    }
    

});

app.post("/bookings", async (req, res) => {

    const { userId, eventId, seats } = req.body;
    if (!userId || !eventId || !seats) {
        return res.status(400).json({ message: "All booking details are required" });
    }
    try{
        const booking = await prisma.booking.create({
            data: {
                userId,
                eventId,
                seats,
                status: "CONFIRMED"
                
            }
        });
        return res.status(201).json({
            message: "Booking created successfully",
            booking: {
                id: booking.id,
                userId: booking.userId,
                eventId: booking.eventId,
                seats: booking.seats,
                
            }
        });  
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }   
});

app.post("/bookings/tx", async (req, res) => {
    const { userId, eventId, seats } = req.body;
    if (!userId || !eventId || !seats) {
        return res.status(400).json({ message: "All booking details are required" });
    }
    try {
        const result = await prisma.$transaction(async(tx)=>{
            const event = await tx.event.findUnique({
                where:{
                    id:eventId

                }
            });
            if(!event){
                throw new Error("Event Not Exist");
            }
            if(event.totalSeats<seats){
                throw new Error("Not Enough Seats");
            }
            

            await tx.event.update({
                where:{
                    id:eventId,

                },
                data:{
                    totalSeats:{
                        decrement:seats,
                    }
                }

            });
            return tx.booking.create({
                data:{
                    userId,
                    eventId,
                    seats,
                    status:"CONFIRMED"
                }
            });
        });
        return res.status(201).json(result);
    }catch(error){
        return res.status(500).json({message: "Internal server error"})
    }

});


app.listen(3002);


