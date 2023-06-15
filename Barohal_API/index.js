const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { resetWatchers } = require("nodemon/lib/monitor/watch");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://Barohal_industry:dofmxSwCGqSzuGOx@cluster0.sc93kvm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function dbConnect(){
    try {
        client.connect();
    } catch (err) {console.log(err.name)}
}

const Products = client.db("Barohal_Industry").collection('products')
dbConnect();


app.get('/products', async (req, res) => {
const cursor =  Products.find({});
const result = await cursor.toArray();
res.send(result);
})

app.get('/product/:id',async (req, res) =>{
  
  const productId = req.params.id;
  const query = {_id: new ObjectId(productId)};
  const result = await Products.findOne(query);
  res.send(result);
})
 

app.post('/add-product', async(req, res) =>{
    try{
        const result = await Products.insertOne(req.body);
        if(result){
            success: true
            message:'Product added successfully'
        }

        else {
            res.send({
              success: false,
              error: "Couldn't Insert the service",
            });
          }

    } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
})

app.delete('/delete-product/:id', async (req, res) =>{
  const productId = req.params.id;
  const query = {_id: new ObjectId(productId)};
  const result = await Products.deleteOne(query);
})
 
app.patch('/update-product/:id', async (req, res)=>{
  const productId = req.params.id;
  console.log('patch ',productId)
  const query = {_id: new ObjectId(productId)};
  const options = {upsert: true};
  const updateProduct = {
    $set: req.body

  }
  const result = await Products.updateOne(query,updateProduct,options);
  res.send(result);
})

app.get("/", (req, res) => {
    res.send(`Welcome to Barohal Industry Limited`);
  });
  
  app.listen(port, () => {
    console.log(`Barohal Industry Limited server runing on port ${port}`);
  });
