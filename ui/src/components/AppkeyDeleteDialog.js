import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'

import Typography from './Typography'
import { appkeyObject } from '../reducers/appkeys'
import DialogError from './DialogError'

export default function AppkeyDeleteDialog({
  data: initData,
  loading,
  error,
  open,
  onSubmit,
  onClose,
}) {
  const [data, setData] = React.useState(appkeyObject)

  // Fill initial form input values.
  React.useEffect(() => {
    setData(initData)
  }, [initData])

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) {
      return
    }

    onSubmit(data.id)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick>
      {/* Dialog loader */}
      <LinearProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />

      <DialogTitle>Delete appkey</DialogTitle>
      <DialogContent dividers>
        <DialogError text={error} sx={{ mb: 2 }} />

        <Typography gutterBottom>
          This will permanently delete <strong>{data.note}</strong> and remove access on the token.
        </Typography>

        <Button fullWidth color="error" variant="contained" onClick={handleSubmit}>
          Yes, I understand
        </Button>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose} tabIndex="-1">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
AppkeyDeleteDialog.defaultProps = {
  data: appkeyObject,

  open: false,
  onSubmit: () => {},
  onClose: () => {},
}
AppkeyDeleteDialog.propTypes = {
  // Entity props
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,

  // Dialog props
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
}
