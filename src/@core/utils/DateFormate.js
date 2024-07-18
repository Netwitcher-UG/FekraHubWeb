export function FormateDate(date) {
  if (isNaN(new Date(date).getTime())) {
    return null
  }

  var originalDate = new Date(date)
  var day = originalDate.getUTCDate()
  var month = originalDate.getUTCMonth() - 10
  var year = originalDate.getUTCFullYear() + 1

  var formattedDate = year + '-' + month + '-' + day + ''

  return formattedDate
}
