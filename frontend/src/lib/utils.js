export function formatData(date) {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  return dateObj.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export const RATES = {
  Bike: 10,
  Car: 20,
  Truck: 50
};

export function calculateParkingFee(entry, exit, vehicleType = 'Car') {
  if (!entry || !exit) return 0;
  const start = new Date(entry);
  const end = new Date(exit);
  if (end <= start) return 0;
  const diffInMs = end - start;
  const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60)); 
  return diffInHours * (RATES[vehicleType] || 20);
}