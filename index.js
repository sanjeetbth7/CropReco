import express from "express";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";


import { spawn } from "child_process";


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('strict routing', true);

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  






app.get("/", async (req, res) => {
    try {
        res.render("index");
        
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    } 
});


app.get("/crop", (req,res)=>{
    res.render("crop",{prediction:" ",userValues:""});
})


/* Connecting Backend with ML model */

// Define the route to handle the prediction
app.post('/predict', (req, res) => {
    // Assuming the request body contains user input data
    const cropDetails = req.body;
    
    const userValues = [cropDetails.N,cropDetails.P,cropDetails.K,cropDetails.pH,cropDetails.rainfall,cropDetails.temperature]



    // console.log(userValues)
    // Spawn a Python child process
    // const pythonProcess = spawn('python', [__dirname+'/ML/modelRes.py', JSON.stringify(userValues)]); // For GausianNB
    const pythonProcess = spawn('python', [__dirname+'/ML/modelResXGB.py', JSON.stringify(userValues)]); // For xgboost

    // Collect data from the Python script
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data;
    });
    console.log("output: "+result);

    // Handle the end of the Python script execution
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        // Successful execution
        console.log(result.trim());
        res.render("crop",{prediction:result, userValues:userValues });
      } else {
        // Error in execution
        console.log("Error in Python script execution");
        res.status(500).send('Error in Python script execution');
      }
    });
  
});




app.post("/crop", (req,res)=>{
  res.render("crop",{prediction:" "});
})



// 404 error handling
app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server started on port ${PORT}`);
});