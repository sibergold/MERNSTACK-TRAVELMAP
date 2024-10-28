const mongoose =  require('mongoose');

const markerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  title: { 
    type: String, 
    required: true 
},
  description: {
     type: String 
    },
  position: {
    lat: { 
        type: Number, 
        required: true },
    lng: { 
        type: Number, 
        required: true }
  },
  rating: { 
    type: Number,
     min: 1, 
     max: 5 }
}, { timestamps: true });

const Marker = mongoose.model('Marker', markerSchema);

module.exports =  Marker;