import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, EMERGENCY_CONTACT, mapStyles } from './constants';
import Navbar from '../Navbar';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: google.maps.LatLng;
  };
  type: string;
}

const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Add auth listener to get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
      setCurrentTime(formattedTime);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const center = currentLocation || { lat: 20.5937, lng: 78.9629 };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const getNearbyPlaces = useCallback((location: { lat: number; lng: number }, type: string) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: type
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(prev => [
          ...prev,
          ...results.map(place => ({
            place_id: place.place_id || '',
            name: place.name || '',
            vicinity: place.vicinity || '',
            geometry: {
              location: place.geometry?.location || new google.maps.LatLng(0, 0)
            },
            type: type
          }))
        ]);
      }
    });
  }, [map]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);

          if (map) {
            map.panTo(location);
            setNearbyPlaces([]);
            ['hospital', 'police', 'fire_station'].forEach(type => 
              getNearbyPlaces(location, type)
            );
          }
        },
        (error) => {
          console.error('Error:', error);
          alert('Please enable location services to use emergency features.');
        }
      );
    }
  }, [map, getNearbyPlaces]);

  const makeEmergencyCall = (phoneNumber: string) => {
    try {
      window.location.href = `tel:${phoneNumber}`;
    } catch {
      alert(`Please call emergency number: ${phoneNumber}`);
    }
  };

  const handleLocationEmergency = () => {
    if (currentLocation) {
      setShowLocationAlert(true);
      makeEmergencyCall(EMERGENCY_CONTACT);
      setTimeout(() => setShowLocationAlert(false), 5000);
    } else {
      alert('Getting your location. Please try again in a moment.');
    }
  };

  const handleWomenChildrenEmergency = () => {
    setShowEmergencyAlert(true);
    makeEmergencyCall('1091');
    setTimeout(() => setShowEmergencyAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-8">
      <Navbar currentTime={currentTime} currentUser={currentUser} />

      <main className="container mx-auto px-4 pt-20">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-white mb-3">Emergency Services</h1>
          <p className="text-gray-400 text-sm">24/7 Support & Immediate Assistance</p>
          <p className="text-sm text-gray-500 mt-2">
            {currentTime} UTC | User: {currentUser}
          </p>
        </div>

        <div className="grid gap-6 mb-6">
          {/* Emergency Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLocationEmergency}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center justify-center space-x-3 text-sm font-medium border border-red-500/20"
            >
              <span className="text-xl">🆘</span>
              <span>Emergency Call ({EMERGENCY_CONTACT})</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWomenChildrenEmergency}
              className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 p-4 rounded-lg flex items-center justify-center space-x-3 text-sm font-medium border border-purple-500/20"
            >
              <span className="text-xl">👧</span>
              <span>Women & Children Emergency</span>
            </motion.button>
          </div>

          {/* Alert Messages */}
          {(showLocationAlert || showEmergencyAlert) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border border-green-500/40 rounded-lg p-4"
            >
              <p className="text-green-400">
                {showLocationAlert ? 'Connecting emergency call...' : 'Emergency alert sent!'}
                {currentLocation && showLocationAlert && (
                  <span className="block text-sm mt-1">
                    Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* Map Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-light text-white mb-6">Your Location & Nearby Services</h2>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
                onLoad={onMapLoad}
                options={{
                  styles: mapStyles,
                  zoomControl: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: true,
                }}
              >
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }}
                  />
                )}

                {nearbyPlaces.map((place: Place) => (
                  <Marker
                    key={place.place_id}
                    position={{
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng()
                    }}
                    onClick={() => setSelectedPlace(place)}
                    icon={{
                      url: `http://maps.google.com/mapfiles/ms/icons/${
                        place.type === 'hospital' ? 'red' :
                        place.type === 'police' ? 'blue' : 'yellow'
                      }-dot.png`
                    }}
                  />
                ))}

                {selectedPlace && (
                  <InfoWindow
                    position={{
                      lat: selectedPlace.geometry.location.lat(),
                      lng: selectedPlace.geometry.location.lng()
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div className="bg-white p-2 rounded-sm">
                      <h3 className="font-bold">{selectedPlace.name}</h3>
                      <p className="text-sm">{selectedPlace.vicinity}</p>
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`;
                          window.open(url, '_blank');
                        }}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                      >
                        Get Directions
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Emergency Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {['Police', 'Ambulance', 'Fire'].map((service, index) => (
              <motion.div
                key={service}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50"
              >
                <h3 className="text-base font-light text-white mb-2">{service}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Emergency: {index === 0 ? '100' : index === 1 ? '108' : '101'}
                </p>
                <button
                  onClick={() => makeEmergencyCall(index === 0 ? '100' : index === 1 ? '108' : '101')}
                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 rounded text-sm font-medium border border-blue-500/20"
                >
                  Call Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-8 border border-gray-700/50"
        >
          <h2 className="text-xl font-light text-white mb-4">About Our Services</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Atlantis Women's Safety Initiative provides 24/7 emergency support and protection services
            for women in distress. Our team of trained professionals ensures immediate response and
            assistance whenever needed.
          </p>
        </motion.div>

        {/* Contact & Location Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50"
          >
            <h2 className="text-xl font-light text-white mb-6">Contact Us</h2>
            <div className="space-y-2 text-gray-300">
              <p>Emergency: 1091 (Toll-Free)</p>
              <p>Helpline: {EMERGENCY_CONTACT}</p>
              <p>Email: help@atlantiswomensafety.org</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50"
          >
            <h2 className="text-xl font-light text-white mb-4">Office Address</h2>
            <address className="text-gray-300 not-italic">
              Atlantis Women's Safety Center<br />
              123 Safety Street, Koramangala<br />
              Bangalore, Karnataka - 560034<br />
              India
            </address>
          </motion.div>
        </div>

        {/* Email Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50"
        >
          <h2 className="text-xl font-light text-white mb-6">Contact Us</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-light mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 text-sm font-light border border-gray-600/50 focus:border-blue-500/50 focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-light mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 text-sm font-light border border-gray-600/50 focus:border-blue-500/50 focus:outline-none"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-light mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 text-sm font-light border border-gray-600/50 focus:border-blue-500/50 focus:outline-none"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-3 rounded-lg text-sm font-medium border border-blue-500/20"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Emergency;