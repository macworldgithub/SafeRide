export const formatNumbersWithCommas = (input: number) => {
  if (Array.isArray(input)) {
    return input.map(num => num.toLocaleString());
  } else if (typeof input === 'number') {
    return input.toLocaleString();
  } else {
    throw new TypeError('Input must be a number or an array of numbers');
  }
};


export const showRideType = (rideType: string) => {
  if (rideType === 'W') {
    return 'One Way';
  } else if (rideType === 'R') {
    return 'Round Trip';
  } else {
    return 'Hourly';
  }
};

export function convertToMinutes(timeString: string) {
  // Initialize variables for hours and minutes
  let hours = 0;
  let minutes = 0;
  
  // Use a regular expression to match hours and minutes
  const regex = /(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?|(\d+)\s*min[s]?/i;
  const match = timeString.match(regex);
  
  if (match) {
      // Extract hours and minutes from the match
      if (match[1]) {
          hours = parseInt(match[1], 10);
      }
      if (match[2]) {
          minutes = parseInt(match[2], 10);
      } else if (match[3]) {
          minutes = parseInt(match[3], 10);
      }
  }
  const total_minutes = Math.floor((hours * 60) + minutes);
  console.log("Total minutes", total_minutes);
  // Convert hours to minutes and add minutes
  return total_minutes;
}