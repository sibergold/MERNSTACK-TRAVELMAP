const Marker = require('../models/markerModel')

const getAllMarkers = async (req, res) => {
    try {
      const markers = await Marker.find({ user: req.user.userId });
      res.json(markers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const createNewMarker =  async (req, res) => {
    const marker = new Marker({
      ...req.body,
      user: req.user.userId
    });
    try {
      const newMarker = await marker.save();
      res.status(201).json(newMarker);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  const updateMarker = async (req, res) => {
    try {
      const marker = await Marker.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        req.body,
        { new: true }
      );
      if (!marker) return res.status(404).json({ message: 'Marker not found' });
      res.json(marker);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  const deleteMarker = async (req, res) => {
    try {
      const marker = await Marker.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
      if (!marker) return res.status(404).json({ message: 'Marker not found' });
      res.json({ message: 'Marker deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

module.exports = {getAllMarkers,createNewMarker, updateMarker , deleteMarker }