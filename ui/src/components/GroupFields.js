import React from 'react'

import { SpacedGroup } from './Spacer'

function GroupFields({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <SpacedGroup>{children}</SpacedGroup>
    </div>
  )
}

export default GroupFields
