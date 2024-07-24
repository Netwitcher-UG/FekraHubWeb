import Translations from 'src/layouts/components/Translations'
export const checkCell = cell => {
  if (!cell || cell == '') return <Translations text={'None'} />
  else return cell
}
