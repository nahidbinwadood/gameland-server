const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    const productsCollection = client.db("GameLand").collection("products");

    //get all the products :

    app.get("/products", async (req, res) => {
      const search = req.query.search;
      const searchString = String(search);
      const brand = req.query.brandName;
      const category = req.query.category;
      const filter = req.query.filter;
      const minPrice = parseInt(req.query.minPrice) || 0;
      const maxPrice = parseInt(req.query.maxPrice) || Infinity;

      //pagination:
      const size=parseInt(req.query.size);
      const page=parseInt(req.query.page)-1
    

      //Search:
      let query = {
        productName: { $regex: searchString, $options: "i" },
        price: { $gte: minPrice, $lte: maxPrice }
      };

      //Brand and category:
      if (brand) query.brand = brand;
      if (category) query.category = category;
      let options = {};

      // Filter:
      if (filter === "asc") {
        options.sort = { price: -1 };
      } else if (filter === "dsc") {
        options.sort = { price: 1 };
      } else if (filter === "new") {
        options.sort = { productCreationDateTime: -1 };
      }
      const result = await productsCollection.find(query, options).skip(size*page).limit(size).toArray();
      res.send(result);
    });
   

    app.get("/products-count", async (req, res) => {
      const count =await productsCollection.countDocuments();
      res.send({count})
    })

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("gameLand is running successfully");
});

app.listen(port, () => {
  console.log(`gameLand is running on ${port}`);
});
