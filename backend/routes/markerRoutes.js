const express =  require ('express');
const {getAllMarkers,createNewMarker, updateMarker , deleteMarker } = require('../controllers/markerController');
const { authenticateToken } = require ('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

// Get all markers for the authenticated user
router.get('/',getAllMarkers);

// Create a new marker
router.post('/',createNewMarker);

// Update a marker
router.put('/:id', updateMarker);

// Delete a marker
router.delete('/:id',deleteMarker );

module.exports = router;