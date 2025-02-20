const mongoose = require('mongoose');

const FragranceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Unisex'], required: true },
  brand: { type: String, required: true },
  scent: [{ type: String }],
  sizes: { type: Map, of: Number }, 
  top_notes: [{ type: String }],
  longevity: { type: String },
  sillage: { type: String },
  season: [{ type: String }],
  image: { type: String } 
});

module.exports = mongoose.model('Fragrance', FragranceSchema);
