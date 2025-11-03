// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ label }) => {
  return <Email label={label} />
}

// Use getServerSideProps to avoid build-time API calls
// This runs at request time, not build time
export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      ...(params && params.label ? { label: params.label } : {})
    }
  }
}

EmailApp.contentHeightFixed = true

export default EmailApp
