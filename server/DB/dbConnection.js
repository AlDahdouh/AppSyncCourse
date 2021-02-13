const MONGODB_URI = require("../config");
const mongoose = require("mongoose");

const createConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connecting to DB...");
  } catch (error) {
    console.error("Error in connecting DB : ", error.message);
  }
};

module.exports = createConnection;
