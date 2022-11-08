const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

//username: dbUser1
//pass: W2FuRoTftfGtcHo2

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zp5ddvi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("users");
  // perform actions on the collection object
  console.log('database connected');
  client.close();
});


app.get('/', (req, res)=>{
    res.send('server is runnig')
})

app.listen(port, () =>{
    console.log(`server running on ${port}`)
})