import houseRoutes from './routes.js';
import express from 'express';
import bodyParser from 'body-parser';
const app = express()
app.use(express.json()); // Parses JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data


const port = 3002





app.use('/house', houseRoutes); // Mount the router

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


