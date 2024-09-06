const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Moiddleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9hcdyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const productsCollection = client.db('FuniFlex').collection('products');
    const cartsCollection = client.db('FuniFlex').collection('carts');

    app.get('/products', async (req, res) => {
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const result = await productsCollection.find().skip(page * size).limit(size).toArray();
        res.send(result);
    })
    app.get('/productsCount', async (req, res) => {
        const count = await productsCollection.estimatedDocumentCount();
        res.send({ count });
    })
    app.get('/allProducts', async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);

    })
    app.post('/cartData', async (req, res) => {
        const cartItem= req.body;
        const result = await cartsCollection.insertOne(cartItem);
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


app.get('/', (req, res) => {
    res.send('FuniFlex is running');
})

app.listen(port, () => {
    console.log(`FuniFlex-server is running on port:${port}`);
})
