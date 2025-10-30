
    
    
  const SUPABASE_URL = "https://mzypfqtaskdtohobobui.supabase.co";  
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eXBmcXRhc2tkdG9ob2JvYnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDExNjUsImV4cCI6MjA3NjE3NzE2NX0.2R2dy315Co006eq--MoHPJpaXDGY9V2TTszwh8y9bf0";  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const addBtn = document.getElementById("addContact");
  const emergencyContainer = document.getElementById("emergencyContainer");

  addBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "emergency-group";
    div.innerHTML = `
      <input type="tel" name="emergency" placeholder="Emergency contact number" required>
      <button type="button" class="remove-btn">X</button>
    `;
    emergencyContainer.appendChild(div);
    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
  });

  document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("number").value.trim();

    const emergencyInputs = document.querySelectorAll('input[name="emergency"]');
    const emergencyNumbers = Array.from(emergencyInputs).map(i => i.value.trim()).filter(v => v);

    if (!name || !phone || emergencyNumbers.length === 0) {
      alert("⚠️ Please fill in all fields!");
      return;
    }

    const { data, error } = await supabase.from("profiles").insert([{
      name,
      phone,
      emergency_contact: emergencyNumbers
    }]);

    const msg = document.getElementById("successMsg");
    if (error) {
      alert("❌ Error: " + error.message);
      console.error(error);
    } else {
      msg.style.display = "block";
      document.getElementById("registrationForm").reset();
      emergencyContainer.innerHTML = `
        <div class="emergency-group">
          <input type="tel" name="emergency" placeholder="Emergency contact number" required>
        </div>`;
      setTimeout(() => msg.style.display = "none", 3000);
    }
  });

















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
    // 1️⃣ Get current location
    const coords = await getUserLocation();
    const lat = coords.latitude;
    const lon = coords.longitude;

    // 2️⃣ Current user's phone number (replace with dynamic value if you have login)
    const currentUserPhone = 'YOUR_PHONE_NUMBER'; // e.g., '918779759296'

    // 3️⃣ Fetch latest profile record for this user
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
        // ensures we get the current user's record
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      alert("❌ Could not fetch profile: " + (error?.message || "No record found"));
      return;
    }

    const userProfile = data[0];

    // 4️⃣ Prepare SOS message with Google Maps link
    const message = `🚨 SOS! I need help! My location: https://www.google.com/maps?q=${lat},${lon}`;

    // 5️⃣ Emergency contacts from the profile
    const contacts = userProfile.emergency_contact; // should be an array
    if (!contacts || contacts.length === 0) {
      alert("⚠️ No emergency contacts found!");
      return;
    }

    // 6️⃣ Open WhatsApp for each contact
    contacts.forEach(number => {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // 7️⃣ Optional: vibrate phone for feedback (mobile only)
    if (navigator.vibrate) navigator.vibrate(500);

    alert("SOS message ready to send on WhatsApp!");

  } catch (err) {
    alert("Could not get location: " + err.message);
  }
});



// Profile button click event
document.getElementById("profile-btn").addEventListener("click", () => {
  // Option 1: open a new page
  window.location.href = "profile.html";

  // Option 2 (if you want a popup instead of a new page):
  // alert("Profile page coming soon!");
});
