import React from 'react'

import Typography from './Typography'
import Zelda from './Link'
import manifest from '../../package.json'
import DataView from './DataView'
import XCard from './XCard'

function VersionForm() {
  return (
    <XCard title="Dashboard" titleTypographyProps={{ color: 'primary' }}>
      <DataView
        data={{
          Version: `v${manifest.version}`,
        }}
      />

      <Typography variant="body2" color="textSecondary">
        {/* Made by ninjas @ <Link color="secondary" href="http://chiligarlic.com" target="_blank">chiligarlic</Link>. */}
        <br />
        Ratatxt Console is made possible by <Zelda to="/credits">open source software</Zelda>.
      </Typography>
    </XCard>
  )
}

export default VersionForm
