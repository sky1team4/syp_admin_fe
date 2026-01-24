require('dotenv').config();

const express = require('express');  
const app = express();
// Access the PORT from environment variables 
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
