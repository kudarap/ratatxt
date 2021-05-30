import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

export default function XCard({ children, className, style, ...other }) {
  return (
    <Card className={className} style={style}>
      <CardHeader {...other} />
      <Divider variant="middle" />
      <CardContent>{children}</CardContent>
    </Card>
  )
}

XCard.propTypes = {
  children: PropTypes.any.isRequired,
}

XCard.defaultProps = {
  className: null,
  style: null,
}
