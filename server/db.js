const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/";

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/iNotebook");
    console.log("Connection to MongoDB Successfull");
  } catch (error) {
    handleError(error);
  }
};

module.exports = connectToMongo;
