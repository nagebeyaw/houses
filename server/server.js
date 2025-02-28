import express from 'express';
import { HousesController } from './controllers/listingController.js';

const app = express();

app.use(express.json());

app.use('/', HousesController);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





