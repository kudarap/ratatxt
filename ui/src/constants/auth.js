import Badge, * as badge from '../components/Badge'

export const levelPending = 10
export const levelVerified = 20
export const levelAdmin = 80

export const levelText = {
  [levelPending]: 'pending',
  [levelVerified]: 'verified',
  [levelAdmin]: 'administrator',
}

export const levelBadges = {
  [levelPending]: <Badge label="Pending" color={badge.colorWaiting} />,
  [levelVerified]: <Badge label="Verified" color={badge.colorVerified} />,
  [levelAdmin]: <Badge label="Administrator" color={badge.colorCompleted} />,
}
