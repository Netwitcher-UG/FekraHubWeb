export function FormateDateTime(date) {
    // Check if the input date is valid
    if (isNaN(new Date(date).getTime())) {
      // Handle invalid date, you might want to throw an error or return an appropriate value

      return null; // or throw new Error("Invalid date format");
    }

    var originalDate = new Date(date);
    var originalDate = new Date(date);
    var day = originalDate.getDate();
    var month = originalDate.getMonth() + 1; // Months are zero-based, so we add 1
    var year = originalDate.getFullYear();
    var hours = originalDate.getHours();
    var minutes = originalDate.getMinutes();
    var seconds = originalDate.getSeconds();

    // Ensure two-digit formatting
    var formattedDay = (day < 10 ? '0' : '') + day;
    var formattedMonth = (month < 10 ? '0' : '') + month;
    var formattedHours = (hours < 10 ? '0' : '') + hours;
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

    var formattedTime = year + '-' + formattedMonth + '-' + formattedDay + ' ' + formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;

    return formattedTime;
  }
