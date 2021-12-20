import React from 'react'
import { connect } from 'react-redux'
import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline'
import secondary from '@material-ui/core/colors/pink'
import grey from '@material-ui/core/colors/grey'
import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow'

import { appSettings } from '../actions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const lightPalette = {
  light: '#62a9af',
  main: '#307a80',
  dark: '#004e54',
  contrastText: '#fff',
}
const lightTheme = {
  typography: {
    fontFamily: 'Ubuntu, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: lightPalette,
    secondary: secondary,
    text: {
      primary: '#3c5757',
      secondary: '#698684',
    },
    background: {
      default: grey[50],
    },
  },
  components: {
    // Fixes wrong bar color.
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          '.MuiLinearProgress-barColorPrimary': {
            background: lightPalette.main,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '.MuiTypography-root': {
            fontSize: '1.15rem',
            // fontWeight: 500,
          },
        },
      },
    },
    MuiTypography: {
      variants: [
        // {
        //   props: { medium: true },
        //   style: {
        //     fontWeight: 500,
        //   },
        // },
        {
          props: { variant: 'h7' },
          style: {
            fontSize: '1.15rem',
            fontWeight: 500,
          },
        },
      ],
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          '.MuiCardHeader-title': {
            fontSize: '1.15rem',
            fontWeight: 500,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: lightPalette.main,
            '& .MuiListItemText-root .MuiTypography-root': {
              fontWeight: 500,
            },
            '& .MuiListItemIcon-root': {
              color: lightPalette.main,
            },
          },
        },
      },
    },
  },
}

const darkPalette = {
  light: '#9adfe4',
  main: '#69adb2',
  dark: '#387e83',
  contrastText: '#fff',
}
const darkBg = {
  root: {
    background: grey['900'],
  },
}
const darkTheme = {
  typography: {
    fontFamily: 'Ubuntu, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: darkPalette,
    secondary: secondary,
    // text: {
    //   primary: '#ecffff',
    //   secondary: '#9ab6b6',
    // },
    background: {
      default: '#171717',
    },
  },
  components: {
    ...lightTheme.components,
    MuiAppBar: {
      styleOverrides: darkBg,
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: darkPalette.main,
            '& .MuiListItemText-root .MuiTypography-root': {
              fontWeight: 500,
            },
            '& .MuiListItemIcon-root': {
              color: darkPalette.main,
            },
          },
        },
      },
    },
  },
}

const mapTheme = {
  light: lightTheme,
  dark: darkTheme,
}

const getTypeBySystemPref = () => {
  if (matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function CustomThemeProvider(props) {
  const [theme, setTheme] = React.useState(lightTheme)

  // Handles app appearance preference.
  const { appearance } = props
  React.useEffect(() => {
    let a = appearance
    if (appearance === 'auto') {
      a = getTypeBySystemPref()
    }

    setTheme(mapTheme[a])
  }, [appearance])

  // Handles system appearance change with auto.
  React.useEffect(() => {
    const handleChange = mm => {
      setTheme(mapTheme[mm.matches ? 'dark' : 'light'])
    }

    // Uses matchMedia polyfill
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addListener(handleChange)
  })

  // const v4Theme = adaptV4Theme(theme)
  return <ThemeProvider theme={theme1}>{props.children}</ThemeProvider>
}

const mapStateToProps = ({ appSettings }) => ({
  appearance: appSettings.appearance,
  theme: appSettings.theme,
})

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(appSettings.get()),
  setSettings: settings => dispatch(appSettings.set(settings)),
})

const LiveThemeProvider = connect(mapStateToProps, mapDispatchToProps)(CustomThemeProvider)

const Theme = Component => props => (
  <CustomThemeProvider>
    {/* CssBaseline kick start an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Button variant="contained">Hello</Button>
    <Button variant="contained" color="primary">primary</Button>
    <Button variant="contained" color="secondary">secondary</Button>
    <Component {...props} />
  </CustomThemeProvider>
)

const theme1 = createTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: yellow[500]
    },
  },
});

const BasicTheme = Component => props => (
  <ThemeProvider theme={theme1}>
    <Typography color="primary">primary</Typography>
    <Typography color="secondary">secondary</Typography>
    <Button variant="contained">Hello</Button>
    <Button variant="contained" color="primary">primary</Button>
    <Button variant="contained" color="secondary">secondary</Button>
  </ThemeProvider>
)


export default BasicTheme
