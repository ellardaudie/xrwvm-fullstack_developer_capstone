const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');

const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
  
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
      const dealerships = await Dealerships.find(); // Fetch all dealerships
      res.json(dealerships); // Send them back as a JSON response
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dealerships' }); // Handle errors
    }
  });

// Express route to fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
      const state = req.params.state;
      const dealerships = await Dealerships.find({ state: state }); // Fetch dealerships by state
      if (dealerships.length > 0) {
        res.json(dealerships); // Send the dealerships back as a JSON response
      } else {
        res.status(404).json({ message: 'No dealerships found in this state' }); // Handle case where no dealerships are found
      }
    } catch (error) {
      console.error('Error fetching dealerships:', error);
      res.status(500).json({ error: 'Error fetching dealerships' }); // Handle errors
    }
  });
  

// Express route to fetch a specific dealership by ID


app.get('/fetchDealer/:id', async (req, res) => {
    try {
      const id = req.params.id;  // Getting the ID from the request
      const dealership = await Dealerships.findOne({ id: id }); // Adjust query based on your data structure (e.g., { id: id })
  
      if (dealership) {
        res.json(dealership); // Send dealership back as a JSON response
      } else {
        res.status(404).json({ error: 'Dealership not found' }); // If not found, send an error message
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dealership' }); // Handle unexpected server errors
    }
  });
  



//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } )
  let new_id = documents[0]['id']+1

  const review = new Reviews({
		"id": new_id,
		"name": data['name'],
		"dealership": data['dealership'],
		"review": data['review'],
		"purchase": data['purchase'],
		"purchase_date": data['purchase_date'],
		"car_make": data['car_make'],
		"car_model": data['car_model'],
		"car_year": data['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
