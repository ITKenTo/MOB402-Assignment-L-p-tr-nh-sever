var db= require('./db');

const productSchema= new db.mongoose.Schema(
    {
         name:{
            type:String,
            required:true
         },
         id_category:{
             type: db.mongoose.Schema.Types.ObjectId, ref:'categoryModel'
         },
         content:{
             type: String,
             required: true
         },
         price:{
            type:Number,
            required:true
         },
         image:{
             type: String,
             required: true
         }
    },
    {collection:'product'}
);

const categorySchema= new db.mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        }
    },
    { collection:'category_product'}
)

let categoryModel= db.mongoose.model("categoryModel", categorySchema);
let productModel = db.mongoose.model("productModel", productSchema);
module.exports={productModel,categoryModel}