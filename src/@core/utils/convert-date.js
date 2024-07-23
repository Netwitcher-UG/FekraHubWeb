export const convertDate = date => {
  const parsedDate = new Date(date)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  const formattedDate = parsedDate?.toLocaleDateString('en-US', options)

  return formattedDate
}
