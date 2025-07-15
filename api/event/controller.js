import prisma from "../../config/prismaClient.js";

//create event
export const createEvent = async (req,res)=>{
    const{title,datetime,location,capacity}=req.body;
    try {
        if(!title || !datetime || !location || !capacity){
            return res.staus(400).json({error:"All fields are required"});
        }
        if(capacity>1000 || capacity<=0){
            return res.staus(400).json({error:"Capacity should be between 1 to 1000."});
        }
 
        const event = await prisma.event.create({
            data:{
                title,
                datetime: new Date(datetime),
                location,
                capacity
            },
            select: {
                id: true
            }
        })

        res.status(200).json({message:"Event created successfully", eventId:event.id});
    } catch (error) {
       res.staus(500).json({message:"Failed to create event",error}); 
    }
}

//get event by id
export const getEvent= async(req,res)=>{
    const {eventId} = req.params;
    try {
        const event= await prisma.event.findUnique({
            where:{id:parseInt(eventId)},
            include:{
                registrations:{
                    include:{
                        user:true
                    }
                }
            }
    })
    if(!event){
        return res.status(404).json({message:"Event not found"});
    }
    res.status(200).json({event});

    } catch (error) {
        res.status(500).json({message:"Failed to get event",error:error.message})
    }
}