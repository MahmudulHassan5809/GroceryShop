if(process.env.NODE_ENV === 'production'){
 module.exports = {
 	mongoURI: 'mongodb+srv://grocery_shop:Mahmudul5809@cluster0-rrhom.mongodb.net/test?retryWrites=true&w=majority',
 }
}else{
  module.exports = {
  	mongoURI : 'mongodb://localhost:27017/grocery_dev'
  }
}
