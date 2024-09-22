const mongoose = require('mongoose');


// Example: Connecting to a MongoDB database
function mongo(){
    

mongoose.connect('mongodb+srv://creativeblaster14:ejzS3i8XBNWKcg24@cluster0.0ep1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/addContent', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...')

).catch(err => console.log(err));

}


module.exports = mongo;
