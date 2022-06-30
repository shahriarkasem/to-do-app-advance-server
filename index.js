const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.z7as8jh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const toDoCollection = client.db('toDoList').collection('notes');

         // get
         app.get('/notes/ongoing', async (req, res) => {
            const email = req.query.email;
            const query = {email: email, complete: false};
            const result = await toDoCollection.find(query).sort({ _id: -1 }).toArray();
            res.send(result);
        })
         app.get('/notes/complete', async (req, res) => {
            const email = req.query.email;
            const query = {email: email, complete: true};
            const result = await toDoCollection.find(query).sort({ _id: -1 }).toArray();
            res.send(result);
        })

        // post
        app.post('/add', async (req, res) => {
            const add = req.body;
            const result = await toDoCollection.insertOne(add);
            res.send(result);
        })

         // put

        // patch
        app.patch('/update', async(req,res) => {
            const data = req.body;
            const id = data.id;
            const filter = {_id: ObjectId(id)}
            const updateDoc = {
                $set: {
                    complete: data.complete,
                }
            }
            const result = await toDoCollection.updateOne(filter, updateDoc)
            res.send(result);
        })

        // delete
        app.delete('/delete/note/:id', async (req, res) => {
            const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const result = await toDoCollection.deleteOne(query);
           res.send(result)
        })
      
        console.log('Database connected')
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('TO DO APP Server is working fine')
})


app.listen(port, () => {
    console.log('To Do App Server is listening on port', port)
})