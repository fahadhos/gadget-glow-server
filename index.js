const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express()

require('dotenv').config()

const port = process.env.PORT || 5001;


// middlewire

app.use(cors())
app.use(express.json())
 


 
const uri = `mongodb+srv://${process.env.DB}:${process.env.DB_KEY}@cluster0.xwjdlj9.mongodb.net/?retryWrites=true&w=majority`;
 
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
    await client.connect();

const productCollection = 
client.db('gadgetglowDB').collection('product')
   
const brandCollection = 
client.db('gadgetglowDB').collection('brand')
   
const cartCollection = client.db('gadgetglowDB').collection('cart')
// add product 

    app.post ('/addproduct', async(req,res)=>{
        const newProduct = req.body;
        console.log(newProduct);
 
        const result = await productCollection.insertOne(newProduct)   
        res.send(result)
    
    })
    // get id from product

    app.get('/addproduct/update/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId (id)}
        const product = await productCollection.findOne(query)
        console.log(product)
        res.send(product)
    })
    // add put for specific product
    app.put('/addproduct/update/:id', async(req,res)=>{
        const id = req.params.id;
        const updateProduct = req.body
        console.log(updateProduct)
        const filter ={_id: new ObjectId(id)}
        const options= {upsert:true}
        const updatedProduct ={
            $set:{
               name: updateProduct.name,
                brandname:updateProduct.brandname,
                type: updateProduct.type,
                price : updateProduct.price,
                desc : updateProduct.desc,
                rating : updateProduct.rating
            }
        }

        const result = await productCollection.updateOne(filter ,updatedProduct,options)

        res.send(result)
    })
    app.post ('/addbrand', async(req,res)=>{
        const newBrand = req.body;
       
        const result = await brandCollection.insertOne(newBrand)
        res.send(result)

    })
// save id in cart for post
app.post('/cart',async(req,res)=>{
    const newproduct = req.body;
  
    const result = await cartCollection.insertOne(newproduct)
    console.log(result);
    res.send(result)
})
// get items by id for showing in cart
 
app.get('/cart', async (req, res) => {
    const cartItems = await cartCollection.find().toArray();
     
 console.log(cartItems); 
     
   res.json(cartItems);
});
// delete from cart 
app.delete('/cart/:id', async(req,res)=>{
    const id = req.params.id;
    console.log('delete from cart',id);
    const query ={_id: new ObjectId (id)}
    const result = await cartCollection.deleteOne(query)
    res.send(result)
    console.log(result);
})
    // get brand products
app.get('/addproduct/:brand', async(req,res)=>{
    const brand = req.params.brand
    const query = { "brandname": (brand)}
   const product = await productCollection.find(query).toArray()
   console.log(product);
 
//    const brandBanner = await brandCollection.find({"brand": (brand)}).toArray()
//    console.log(brandBanner,'brand bnner ')
// res.send(brandBanner,product)
 res.send(product)
})

// get product using id for showing the details only

app.get('/details/:id' ,async(req,res)=>{

    const id = req.params.id
    console.log(id,'from details');
    const query ={ _id: new ObjectId (id)}
    const product = await productCollection.findOne(query)
    console.log(product);
    res.send(product)
})

    // brand get 
    app.get('/addbrand', async(req,res)=>{
        const cursor = brandCollection.find()
        const result = await cursor.toArray()

        res.send(result)
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

app.get('/', (req,res)=>{
    res.send('Product Server is running')
})
 

app.listen(port,()=>{
    console.log(`listening on ${port}`);
})