const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// const uri = 'mongodb://localhost:27017';
// const uri = "mongodb+srv://<username>:<password>@cluster0.bi44cht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.bi44cht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    //should comment below line
    await client.connect();

    const happyToursCollection = client
      .db("happyToursDB")
      .collection("happyTours");
    const countryCollection = client.db("happyToursDB").collection("Countries");

    app.post("/happyTours", async (req, res) => {
      const newCoffee = req.body;
      const result = await happyToursCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.get("/happyTours", async (req, res) => {
      const cursor = happyToursCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/happyTours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await happyToursCollection.findOne(query);
      res.send(result);
    });

    //update by id
    app.put("/happyTours/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedHappyTours = req.body;

      const happyTours = {
        $set: {
          photoUrl: updatedHappyTours.photoUrl,
          touristsSpotName: updatedHappyTours.touristsSpotName,
          countryName: updatedHappyTours.countryName,
          location: updatedHappyTours.location,
          shortDescription: updatedHappyTours.shortDescription,
          averageCost: updatedHappyTours.averageCost,
          seasonality: updatedHappyTours.seasonality,
          travelTime: updatedHappyTours.travelTime,
          totaVisitorsPerYear: updatedHappyTours.totaVisitorsPerYear,
          email: updatedHappyTours.email,
          userName: updatedHappyTours.userName,
        },
      };

      const result = await happyToursCollection.updateOne(
        filter,
        happyTours,
        options
      );
      res.send(result);
    });

    app.delete("/happyTours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await happyToursCollection.deleteOne(query);
      res.send(result);
    });

    //countries
    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //search by country name
    app.get("/happyTours/:name", async (req, res) => {
      const country = req.params.name;
      console.log(req);
      const query = { countryName: country };
      const result = await happyToursCollection.find(query).toArray();
      res.send(result);
      console.log(result, query, country);
    });

    app.get("/countries/:name", async (req, res) => {
      const country = req.params.name;
      console.log(req);
      const query = { countryName: country };
      const result = await happyToursCollection.find(query).toArray();
      res.send(result);
      console.log(result, query, country);
    });

    // Send a ping to confirm a successful connection
    //should comment below line
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Happy Tours server is running");
});

app.listen(port, () => {
  console.log(`Happy Tours server is running on ${port}`);
});
