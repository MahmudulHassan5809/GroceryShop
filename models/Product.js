const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const URLSlugs = require('mongoose-url-slugs');
const random = require('mongoose-simple-random');
const mongooseAlgolia = require('mongoose-algolia');

//Create Schema
const ProductSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  name:{
    type: String,
   },
  price: {
  	type: String
  },
  sellingPrice: {
    type: String
  },
  quantity: {
      type: String
  },
  slug: {
      type: String
  },
  description: {
      type: String
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'admin'
  },
  image: {
  	type: String
  },
  productRatings: [{
    userName: {type: String, default: ''},
    userImage: {type: String, default: ''},
    userRating: {type: Number, default: 0},
    userReview: {type: String, default: ''},
  }],
  ratingNumber: [Number],
  ratingSum : {type: Number, default: 0},
  date:{
    type: Date,
    default: Date.now
  }
});

ProductSchema.plugin(random);
//{usePushEach: true}
//ProductSchema.plugin(URLSlugs('name',{field: 'slug'}));

ProductSchema.plugin(mongooseAlgolia,{
  appId: 'B81GZXY2VQ',
  apiKey: 'ed6082718728418e6c508f78669e9a7a',
  indexName: 'ProductSchema',
  selector: 'name _id slug category description sellingPrice image',
  populate: {
    path: 'category',
    select: 'name'
  },
  defaults: {
    author: 'unknown'
  },
  mappings: {
    title: function(value) {
      return `Title : ${value}`
    }
  },
  virtuals: {
    whatever: function(doc) {
      return `Custom data ${doc.title}`
    }
  },
  debug: true // Default: false -> If true operations are logged out in your console
});


let Model = mongoose.model('Product', ProductSchema);

Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
Model.SetAlgoliaSettings({
  searchableAttributes: ['name','category'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
});



module.exports = Product = mongoose.model('product',ProductSchema);
