const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const currEnv = process.env.NODE_ENV;

console.log('Using ' + currEnv + " as current environment.");

const config1 = require(`../config/config.dev.json`);

const usersRouter = require('./router/usersRouter');
const logger = require('./logger/logger');
const auth = require('./middleware/auth');
const cors = require("cors");



//middleware configuration
app.use((req, res, next) => {
    const { method, path } = req;
    console.log(
        `New request to: ${method} ${path} at ${new Date().toISOString()}`
      );

      next();
    
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/users", usersRouter);


app.use((error, req, res, next) => {

    logger.error('Error Occured', error);
    res.status(error.statusCode || 500).json({error_message: error.message, error_detail: error.details, error_date: error.date}); 
});



console.log('Server has been started');

app.listen(config1.serverPort, () => {
    console.log(`Listing on port ${config1.serverPort}`);
});