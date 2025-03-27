const calculateTotaltime = (rowData) => {
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const totals = {}

  // Initialize totals for each day to 0 minutes
  dayNames.forEach((day) => (totals[day] = 0))

  // Convert "hours:minutes" to total minutes
  const timeToMinutes = (time) => {
    if (!time) return 0 // Empty or invalid time
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Convert total minutes back to "hours:minutes"
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  // Iterate through the rowData and sum up the minutes for each day
  rowData.forEach((row) => {
    dayNames.forEach((day) => {
      const hoursWorked = row[day]?.hours_worked || ''
      totals[day] += timeToMinutes(hoursWorked)
    })
  })

  // Convert the totals back to "hours:minutes" format
  const result = {}
  Object.keys(totals).forEach((day) => {
    result[day.charAt(0) + day.slice(1)] = minutesToTime(totals[day])
  })

  return result
}


function calculateRowTotal(row) {
  // Convert "hours:minutes" to total minutes
  const timeToMinutes = time => {
      if (!time) return 0; // Handle empty or invalid time
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
  };

  // Convert total minutes back to "hours:minutes"
  const minutesToTime = minutes => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  // Sum all the "hours_worked" fields for the row
  let totalMinutes = 0;
  for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
      if (row[day]?.hours_worked) {
          totalMinutes += timeToMinutes(row[day].hours_worked);
      }
  }

  // Return the total time in "hours:minutes" format
  return minutesToTime(totalMinutes);
}


function sumHoursWorked(timesheets) {
  let totalMinutes = 0;

  timesheets.forEach(({ hours_worked }) => {
      const [hours, minutes] = hours_worked.split(':').map(Number);
      totalMinutes += hours * 60 + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}`;
}

export { calculateTotaltime,calculateRowTotal,sumHoursWorked }
