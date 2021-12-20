import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Link from '@material-ui/core/Link'

import Typography from '../components/Typography'
import packageJSON from '../../package.json'

const useStyles = makeStyles(theme => ({
  appBar: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
  },
}))

const { dependencies, devDependencies } = packageJSON
const deps = { ...dependencies, ...devDependencies }

let rows = []
for (const n in deps) {
  rows.push({ name: n, ver: deps[n].replace('^', '') })
}

function Credits() {
  const classes = useStyles()
  return (
    <div className={classes.appBar}>
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Typography color="primary" variant="h5" gutterBottom align="center">
            Credits
          </Typography>
          <Table className={classes.table}>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      href={`https://www.npmjs.com/package/${row.name}/v/${row.ver}`}
                      target="_blank">
                      {row.ver}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>
  )
}

export default Credits
