const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const MovieSchema=require('./schema');
const app=express();
const port=5000;
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Connected to database"))
.catch((error)=>console.log("error",error));

app.get("/movies",async(req ,res)=>{
    try{
        const data=await MovieSchema.find();
        if(!data ){
          return res.status(404).json({message:"Not found"});
        }
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:"Internal Server error"});
    }
});

app.get("/movies/:id",async(req ,res)=>{
    try{
        const data=await MovieSchema.findById(req.params.id);
        if(!data){
             return res.status(404).json({message:"Not found"});
        }
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:"Internal Server error"});
    }
});

app.post("/movies",async(req ,res)=>{
    try{
        const {title, director,genre,releaseYear,availableCopies}=req.body;
        if(!title || !director ||!genre ||! releaseYear ||! availableCopies){
            res.status(400).json({message:"Bad request:All the feilds are required here."});
        }
        const newMovie=new MovieSchema({title,director,genre,releaseYear,availableCopies});
        await newMovie.save();
        res.status(200).json({message:"Succesfull request"});
    }catch(error){
        res.status(400).json({message:"Bad request"})
    }
});


app.put("/movies/:id",async(req ,res)=>{
    try{
        const updateMovie=await MovieSchema.findByIdAndUpdate(req.params.id);
        if(!updateMovie){
            res.status(404).json({message:"Not found"});
        }res.status(200).json({message:"Updated succesfully"});
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});

app.delete("/movies/:id",async(req ,res)=>{
    try{
        const deleteMovie=await MovieSchema.findByIdAndDelete(req.params.id,req.body);
        if(!deleteMovie){
            res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({message:"Deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});


app.listen(port,()=>{
    console.log(`Server is running on port: http://localhost:${port}`)
});