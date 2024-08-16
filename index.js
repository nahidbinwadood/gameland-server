const express = require('express');
const cors = require('cors');
const app=express();
require("dotenv").config();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');



//middleware:
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1tjtzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const productsCollection=client.db("GameLand").collection("products")
   
    //get all the products :

    app.get("/products",async(req,res)=>{
        const result=await productsCollection.find().toArray();
        res.send(result)
    })
    // Send a ping to confirm a successful connection
     
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("gameLand is running successfully")
})

app.listen(port,()=>{
    console.log(`gameLand is running on ${port}`);
})