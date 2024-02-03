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
    res.render("crop",{prediction:" "});
})


/* Connecting Backend with ML model */





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