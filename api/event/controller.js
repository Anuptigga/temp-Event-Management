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

//register for event
export const registerForEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const userId = parseInt(req.body.userId);

  if (!eventId || !userId) {
    return res.status(400).json({ message: "eventId and userId are required" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });
    if (!event)return res.status(404).json({ message: "Event not found" });
    

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)return res.status(404).json({ message: "User not found" });


    if (new Date(event.datetime) < new Date())return res.status(400).json({ message: "Registration closed (event already occurred)" });


    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing)return res.status(400).json({ message: "User already registered for this event" });


    const registrationCount = await prisma.registration.count({
      where: { eventId },
    });
    if (registrationCount >= event.capacity)return res.status(400).json({ message: "Event registration is full" });

    
    const registration = await prisma.registration.create({
      data: { userId, eventId },
    });
    res.status(200).json({
      message: "Registration successful",
      registrationId: registration.id,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to register", error: error.message });
  }
};

//cancel registration
export const cancelRegistration = async (req,res)=>{
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.body.userId);
    if(!eventId || !userId)return res.status(400).json({message:"eventId and userId are required"})
    try {
        const existing = await prisma.registration.findUnique({
            where:{userId_eventId:{userId,eventId}}
        })
        if(!existing)return res.status(400).json({message:"User is not registered for this event"})

        await prisma.registration.delete({
            where:{userId_eventId:{userId,eventId}}
        })
        res.status(200).json({message:"Registration cancelled"})
    } catch (error) {
        res.status(500).json({message:"Failed to cancel registration",error:error.message})
    }
}

//get futureEvents
export const upcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await prisma.event.findMany({
      where: {
        datetime: {
          gt: new Date(),
        },
      },
      orderBy: [
        { datetime: "asc" },
        { location: "asc" },
      ],
    });

    res.status(200).json({ events: upcomingEvents });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get upcoming events",
      error: error.message,
    });
  }
};

//get event stats
export const getEventStats = async(req,res)=>{
    try {
        const eventId = parseInt(req.params.eventId)
        if(!eventId)return res.status(400).json({message:"eventId required"})
        const event = await prisma.event.findUnique({
            where:{id:eventId}
        })
        if(!event)return res.status(404).json({message:"Event not found"})
        const registrationCount = await prisma.registration.count({
            where:{eventId}
        })
        
        const remainingRegistration = event.capacity- registrationCount;
        const percetUsed = Math.round((registrationCount/event.capacity)*100);
        res.status(200).json({
            eventId,
            totalRegistration : registrationCount,
            remainingCapacity : remainingRegistration,
            percentageOfCapacityUsed : percetUsed
        })
        
    } catch (error) {
        res.status(500).json({message:"Failed to get stats",error:error.message})
    }
}