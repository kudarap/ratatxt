import Badge, * as badge from '../components/Badge'

export const statusActive = 20
export const statusDisabled = 40

export const statusText = {
  [statusActive]: 'Active',
  [statusDisabled]: 'Disabled',
}

export const statusBadge = {
  [statusActive]: <Badge label="Active" color={badge.colorVerified} />,
  [statusDisabled]: <Badge label="Disabled" color={badge.colorCancelled} />,
}
