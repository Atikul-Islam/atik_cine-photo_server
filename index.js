const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());


//added mongo & services
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zp5ddvi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection = client.db('cinePhoto').collection('services')
        const reviewsCollection = client.db('cinePhoto').collection('reviews')
        
//services
        app.get('/', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).limit(3);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.send(service)
        } )
// reviews
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            let query = {}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = {s_id:id}
            const cursor = reviewsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
            
        })

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)

        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const comment = req.body.comment;
            const query = {_id: ObjectId(id)}
            const updatedMessage = {
                $set:{ comment: comment}
            }
            const result = await reviewsCollection.updateOne(query,updatedMessage)
            res.send(result)
        })

        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service)
            res.send(result)
        })
    }
    finally{

    }
}

run().catch(err => console.error(err))

app.listen(port, () =>{
    console.log(`server running on ${port}`)
})