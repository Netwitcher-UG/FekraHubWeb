export function FormateDate(date) {
  if (isNaN(new Date(date).getTime())) {
    return null
  }

  var originalDate = new Date(date)
  var day = originalDate.getDate();
  var month = originalDate.getMonth() + 1; // Months are zero-based, so we add 1
  var year = originalDate.getFullYear();

  var formattedDate = year + '-' + month + '-' + day + ''

  return formattedDate
}
