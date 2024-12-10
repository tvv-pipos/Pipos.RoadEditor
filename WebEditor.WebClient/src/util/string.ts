function toStr(value: number) {
    return isNaN(value) ? "" : String(value);
}

function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) {
        return "";
    }
    seconds = Math.round(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    let timeString = "";

    if (hours > 0) {
        timeString += `${hours} h`;
    }

    if (minutes > 0) {
        if (hours > 0) {
            timeString += " ";
        }
        timeString += `${minutes} m`;
    }
    
    if (timeString == "")
      timeString = `${seconds} s`;

    return timeString;
}

function formatDistance(meters: number): string {
    if (isNaN(meters) || meters < 0) {
      return "";
    }
  
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      const kilometers = (meters / 1000).toFixed(2);
      return `${kilometers} km`;
    }
  }


function formatBoolean(prop: boolean): string {
  return prop ? "Ja" : "Nej"; 
}
  
export { toStr, formatTime, formatDistance, formatBoolean};