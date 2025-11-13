const key = (userId) => `trips:${userId}`;

export function getTrips(userId) {
  const raw = localStorage.getItem(key(userId));
  return raw ? JSON.parse(raw) : [];
}

export function saveTrips(userId, trips) {
  localStorage.setItem(key(userId), JSON.stringify(trips));
}

export function addTrip(userId, trip) {
  const trips = getTrips(userId);
  trips.push(trip);
  saveTrips(userId, trips);
}

export function getTrip(userId, tripId) {
  const trips = getTrips(userId);
  return trips.find((t) => t.id === Number(tripId)) || null;
}

export function updateTrip(userId, updatedTrip) {
  const trips = getTrips(userId);
  const idx = trips.findIndex((t) => t.id === Number(updatedTrip.id));
  if (idx !== -1) {
    trips[idx] = updatedTrip;
    saveTrips(userId, trips);
  }
}

export function deleteTrip(userId, tripId) {
  const trips = getTrips(userId).filter((t) => t.id !== Number(tripId));
  saveTrips(userId, trips);
}
