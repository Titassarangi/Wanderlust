const mongoose = require("mongoose");
const initData = require("./data.js"); // Import initData
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Fix image data to be a string URL
const fixImageUrl = (imageData) => {
  if (typeof imageData === 'object' && imageData.url) {
    return { filename: imageData.filename, url: imageData.url };
  }
  return { filename: 'listingimage', url: imageData };
};

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "669e9362c9ad0c9321530ae3",
    image: fixImageUrl(obj.image),
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};

initDB();
