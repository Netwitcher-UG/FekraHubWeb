export const convertDate = date => {
  const parsedDate = new Date(date)
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // getMonth() returns 0-11
  const year = parsedDate.getFullYear()

  // Format the date as 'dd.MM.yyyy'
  return `${day}.${month}.${year}`
}
