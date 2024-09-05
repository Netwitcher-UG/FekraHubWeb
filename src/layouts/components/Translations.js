// ** Third Party Import
import { useTranslation } from 'react-i18next'

const Translations = ({ text }) => {
  // ** Hook
  const { t } = useTranslation()

  // Use the original text as fallback if the translation is not found
  const translatedText = t(text, text)

  return <>{translatedText}</>
}

export default Translations
