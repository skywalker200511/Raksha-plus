// =====================
// MAP INITIALIZATION
// =====================
let map = L.map('map').setView([20.5937, 78.9629], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Marker for user's location
let marker = L.marker([20.5937, 78.9629]).addTo(map)
  .bindPopup('You are here')
  .openPopup();

// Function to update location
function onLocationFound(e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  marker.setLatLng([lat, lon]);
  map.setView([lat, lon], 16);

  document.getElementById('lat').textContent = lat.toFixed(5);
  document.getElementById('lon').textContent = lon.toFixed(5);
}

// Function if location not found / permission denied
function onLocationError(e) {
  console.warn("Could not get location. Using default position.");
}

// Ask browser to get location and watch for changes
map.locate({ setView: true, watch: true, maxZoom: 16 });

// Bind events
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Fix disappearing map issue on load
window.addEventListener('load', () => map.invalidateSize());

// =====================
// ZONES (Static)
// =====================
L.circle([19.214639, 72.820861], {
  color: 'blue',
  fillColor: '#3399ff',
  fillOpacity: 0.3,
  radius: 100
}).addTo(map).bindPopup("Police Station Zone");

L.circle([19.201611, 72.829945], {
  color: 'red',
  fillColor: '#ff4d4d',
  fillOpacity: 0.3,
  radius: 200
}).addTo(map).bindPopup("Red Zone");

L.circle([19.192583, 72.834611], {
  color: 'yellow',
  fillColor: '#ffff66',
  fillOpacity: 0.3,
  radius: 200
}).addTo(map).bindPopup("Yellow Zone");

L.circle([19.209667, 72.817445], {
  color: 'yellow',
  fillColor: '#ffff66',
  fillOpacity: 0.3,
  radius: 200
}).addTo(map).bindPopup("Yellow Zone");

L.circle([19.206222, 72.824250], {
  color: 'yellow',
  fillColor: '#ffff66',
  fillOpacity: 0.3,
  radius: 200
}).addTo(map).bindPopup("Yellow Zone");

// =====================
// SOS BUTTON
// =====================
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords),
        err => reject(err)
      );
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
}

document.getElementById("sos-btn").addEventListener("click", async () => {
  try {
    const coords = await getUserLocation();
    const lat = coords.latitude;
    const lon = coords.longitude;

    const message = `🚨 SOS! I need help! My location: https://www.google.com/maps?q=${lat},${lon}`;

    // Example emergency contact numbers (hardcoded for now)
    const emergencyContacts = [
      "918779759296"
      
    ];

    emergencyContacts.forEach(number => {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    });

    if (navigator.vibrate) navigator.vibrate(500);
    alert("SOS message ready to send on WhatsApp!");

  } catch (err) {
    alert("Could not get location: " + err.message);
  }
});

// =====================
// PROFILE BUTTON
// =====================
document.getElementById("profile-btn").addEventListener("click", () => {
  window.location.href = "profile.html";
});
