const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apuyeda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const touristsSpotCollection = client.db("touristsSpotDB").collection("touristsSpot")
    const countryCollection = client.db("touristsSpotDB").collection("countryData")

    app.post('/touristsSpot', async(req,res)=>{
      const touristsSpot = req.body;
      const result = await touristsSpotCollection.insertOne(touristsSpot)
      res.send(result)
    })

    app.get('/touristsSpot',async(req,res)=>{
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/country',async(req,res)=>{
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/touristsSpot/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotCollection.findOne(query)
      res.send(result)
    })

    app.delete('/touristsSpot/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/touristsSpot/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedSpot = req.body
      const coffee = {
        $set: {
          spotName:updatedSpot.spotName, 
          countryName:updatedSpot.countryName, 
          location:updatedSpot.location, 
          averageCost:updatedSpot.averageCost,
          seasonality:updatedSpot.seasonality,
          travelTime:updatedSpot.travelTime,
          totalVisitors:updatedSpot.totalVisitors,
          photo:updatedSpot.photo,
          description:updatedSpot.description,
        }
      }
      const result = await touristsSpotCollection.updateOne(filter,coffee,options)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('TRAVEL ASIA SERVER IS RUNNING')
})

app.listen(port,()=>{
    console.log(`TRAVEL ASIA is listen on port${port}`);
})