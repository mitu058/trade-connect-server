const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lg2je.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const jobsCollection = client.db('marketNest').collection('jobs');

app.post('/add-job',async(req,res)=>{
    const jobData = req.body;
    const result = await jobsCollection.insertOne(jobData);
    res.send(result);
    
})

app.get('/jobs',async(req,res)=>{
    const result = await jobsCollection.find().toArray();
    res.send(result);
})

// get all jobs posted by a specific user
app.get('/jobs/:email',async(req,res)=>{
  const email = req.params.email
  const query = {'buyer.email' : email}
  const result = await jobsCollection.find(query).toArray();
  res.send(result);
})

// delete a job from db
app.delete('/job/:id',async(req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await jobsCollection.deleteOne(query);
  res.send(result);
})

// get a single job data by id from db
app.get('/job/:id',async(req,res){
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await jobsCollection.findOne(query);
  res.send(result);
})
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("TradeConnect Server is running!");
})

app.listen(port, () => console.log(`TradeConnect Server running on port ${port}`));
