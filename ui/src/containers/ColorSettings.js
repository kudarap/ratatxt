import React from 'react'
import { connect } from 'react-redux'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

import { appSettings } from '../actions'
import XCard from '../components/XCard'

function ColorSettings(props) {
  const [appearance, setAppearance] = React.useState(props.appearance || 'light')

  const { getSettings } = props
  React.useEffect(() => {
    getSettings()
  }, [getSettings])

  const { setSettings } = props
  const handleChange = e => {
    const val = e.target.value
    setAppearance(val)
    setSettings({
      appearance: val,
    })
  }

  return (
    <XCard title="Appearance">
      <FormControl variant="standard" component="fieldset">
        <RadioGroup
          row
          aria-label="position"
          name="position"
          value={appearance}
          onChange={handleChange}>
          <FormControlLabel
            value="auto"
            control={<Radio color="primary" size="small" />}
            label="Auto"
            labelPlacement="end"
          />
          <FormControlLabel
            value="light"
            control={<Radio color="primary" size="small" />}
            label="Light"
            labelPlacement="end"
          />
          <FormControlLabel
            value="dark"
            control={<Radio color="primary" size="small" />}
            label="Dark"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </XCard>
  )
}

const mapStateToProps = ({ appSettings }) => ({
  appearance: appSettings.appearance,
  theme: appSettings.theme,
})

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(appSettings.get()),
  setSettings: settings => dispatch(appSettings.set(settings)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ColorSettings)
