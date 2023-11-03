const mongo = require('mongoose');
const MONGO_URI = "";

const connect = () => {
    try{ 
        mongo.connect(MONGO_URI)
        console.log(MONGO_URI);
        console.log("Connected to Database");
    } catch(err) {
        console.log(err);
    }
}    

module.export = connect;