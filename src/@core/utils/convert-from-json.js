export const convertFromJson = list => {
  return list
    .split('},')
    .map(item => item.replace(/[{}]/g, '').trim())
    .filter(item => item !== '')
    .map(item => {
      const [key, value] = item.split(':').map(str => str.trim().replace(/'/g, ''))
      return { key, value }
    })
}
