import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useAuth } from '../contexts/AuthContext';
import '../css/map.css';

const center = {
  lat: 0,
  lng: 0
};

interface MarkerData {
  _id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  description: string;
  rating: number;
}

const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: 1
  });
  const [newMarkerPosition, setNewMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const { token } = useAuth();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR GOOGLE API KEY" // Replace with your actual API key
  });

  useEffect(() => {
    if (token) {
      fetchMarkers();
    }
  }, [token]);

  const fetchMarkers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/markers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  const onMapDoubleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setIsFormOpen(true);
      setNewMarkerPosition(e.latLng.toJSON());
      setFormData({
        title: '',
        description: '',
        rating: 1
      });
      setEditingMarker(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerPosition && !editingMarker) return;

    const markerData = {
      _id: editingMarker?._id || undefined, // Düzenleme modundaysa mevcut ID'yi ekle
      position: editingMarker ? editingMarker.position : newMarkerPosition!,
      title: formData.title,
      description: formData.description,
      rating: formData.rating
    };

    try {
      const response = await fetch(editingMarker ? `http://localhost:5000/api/markers/${editingMarker._id}` : 'http://localhost:5000/api/markers', {
        method: editingMarker ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(markerData)
      });

      if (response.ok) {
        const savedMarker = await response.json();
        setMarkers(editingMarker ? markers.map(m => (m._id === savedMarker._id ? savedMarker : m)) : [...markers, savedMarker]);
        setIsFormOpen(false); // Formu kapat
        setNewMarkerPosition(null);
        setEditingMarker(null);
        setSelectedMarker(null); // Bilgileri sakla
      }
    } catch (error) {
      console.error('Error saving marker:', error);
    }
  };

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
  };

  const handleDeleteMarker = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/markers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMarkers(markers.filter(marker => marker._id !== id));
        setSelectedMarker(null);
      }
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };

  return isLoaded ? (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={3}
        onDblClick={onMapDoubleClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker._id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
      </GoogleMap>

      {isFormOpen && (
        <form className="marker-form" onSubmit={handleFormSubmit}>
          <h3>{editingMarker ? 'Edit Marker' : 'New Marker'}</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsFormOpen(false)}>Cancel</button>
        </form>
      )}

      {selectedMarker && (
        <div className="marker-details">
        <button className="close-btn" onClick={() => setSelectedMarker(null)}>✖</button>
        <h3 className="font-bold">{selectedMarker.title}</h3>
        <p>{selectedMarker.description}</p>
        <p>Rating: {selectedMarker.rating}/5</p>
        
        {/* Button container for spacing */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setIsFormOpen(true); setEditingMarker(selectedMarker); setFormData({ title: selectedMarker.title, description: selectedMarker.description, rating: selectedMarker.rating }); }}> Edit </button>
          <button onClick={() => handleDeleteMarker(selectedMarker._id)}>Delete</button>
        </div>
      </div>
      
      )}
    </div>
  ) : <></>;
};

export default Map;
