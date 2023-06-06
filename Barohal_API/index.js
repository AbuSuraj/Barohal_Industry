const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const result = await cursor.toArray()
if(result ){
    res.send({
        success: true,
        data: result,
    });
} else {
    res.send({success: false, data:"no data founnd"});
}
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

app.get("/", (req, res) => {
    res.send(`Welcome to Barohal Industry Limited`);
  });
  
  app.listen(port, () => {
    console.log(`Barohal Industry Limited server runing on port ${port}`);
  });
