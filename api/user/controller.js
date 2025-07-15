import prisma from "../../config/prismaClient.js"

//create user
export const createUser = async(req,res)=>{
    try {
        const {name,email}= req.body;
        if(!name || !email){
            return res.status(200).json({message:"All fields are required"});
        } 
        const user = await prisma.user.create({
            data:{
                name,
                email
            },
            select:{
                id:true,
            }
        })
        res.status(200).json({message:"User created successfully",userId:user.id})
    } catch (error) {
        res.status(500).json({message:"Failed to create user",error:error.message});  
    }
}