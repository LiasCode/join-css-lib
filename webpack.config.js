const path = require("path");

module.exports = {
  mode: "production", // "production" | "development" | "none"
 
  entry: "./src/index.js", 
  
  output: {
    path: path.resolve(__dirname, "dist"), 
    filename: "[name].js", 
  },
};
