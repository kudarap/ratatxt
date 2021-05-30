import React from 'react'

import ApiVersion from '../../containers/ApiVersionView'
import AppVersion from '../../components/AppVersion'

function About() {
  return (
    <>
      {/* App details */}
      <AppVersion />
      <br />

      {/* API details */}
      <ApiVersion />
    </>
  )
}

export default About
