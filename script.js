// Initialize the map at a default location (center of India)
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

    // Update marker position
    marker.setLatLng([lat, lon]);

    // Center the map on user's location
    map.setView([lat, lon], 16);

    // Update overlay with coordinates
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

// Force Leaflet to recalc size after page load (fixes disappearing map)
window.addEventListener('load', () => {
    map.invalidateSize();
});
// Example: center at lat=19.0760, lon=72.8777 (Mumbai)

L.circle([19.214639, 72.820861], {
    color: 'blue',        // border color
    fillColor: '#3399ff', // fill color
    fillOpacity: 0.3,     // transparency
    radius: 100           // radius in meters
}).addTo(map)
.bindPopup("Police Station Zone");
L.circle([19.201611, 72.829945], {
    color: 'red',        // border color
    fillColor: '#ff4d4d',// fill color
    fillOpacity: 0.3,    // transparency
    radius: 200          // radius in meters (smaller)
}).addTo(map)
.bindPopup("Red Zone");
L.circle([19.192583, 72.834611], {
    color: 'yellow',      // border color
    fillColor: '#ffff66', // fill color
    fillOpacity: 0.3,     // transparency
    radius: 200           // radius in meters
}).addTo(map)
.bindPopup("Yellow Zone");
L.circle([19.209667, 72.817445], {
    color: 'yellow',      // border color
    fillColor: '#ffff66', // fill color
    fillOpacity: 0.3,     // transparency
    radius: 200           // radius in meters
}).addTo(map)
.bindPopup("Yellow Zone");
L.circle([19.206222, 72.824250], {
    color: 'yellow',      // border color
    fillColor: '#ffff66', // fill color
    fillOpacity: 0.3,     // transparency
    radius: 200           // radius in meters
}).addTo(map)
.bindPopup("Yellow Zone");




//sos button
// Function to get user's current location
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

// SOS button click handler
document.getElementById("sos-btn").addEventListener("click", async () => {
    try {
        // Get current location
        const coords = await getUserLocation();
        const lat = coords.latitude;
        const lon = coords.longitude;

        // Prepare SOS message with Google Maps link
        const message = `🚨 SOS! I need help! My location: https://www.google.com/maps?q=${lat},${lon}`;

        // Emergency contacts (international format)
        const contacts = ['918779759296']; // replace with your number or add more

        // Open WhatsApp for each contact
        contacts.forEach(number => {
            window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
        });

        // Optional: vibrate phone for feedback (mobile only)
        if (navigator.vibrate) navigator.vibrate(500);

        alert("SOS message ready to send on WhatsApp!");

    } catch (err) {
        alert("Could not get location: " + err.message);
    }
});
