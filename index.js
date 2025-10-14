require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3b4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const personCollection = client.db('person-manager').collection('persons');

        // home api
        app.get('/', (req, res) => {
            res.send("Yes. The server is running.")
        })

        app.post('/add-person', async (req, res) => {
            const data = req.body;
            const result = await personCollection.insertOne(data);
            res.send(result);
        })

        app.get('/all-persons', async (req, res) => {
            const result = await personCollection.find().toArray();
            res.send(result);
        })

    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})