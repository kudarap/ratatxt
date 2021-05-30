import React from 'react'
import debounce from 'lodash/debounce'
import { experimentalStyled as styled, alpha } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  // border: `1px solid ${theme.palette.divider}`,
  border: `1px solid ${alpha(theme.palette.grey[500], 0.5)}`,
  // backgroundColor: alpha(theme.palette.grey[400], 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[400], 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    // marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  color: 'inherit',
  // color: theme.palette.text.secondary,
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

function SearchInput(props) {
  const debounced = debounce(val => {
    props.onChange(val)
  }, 500)

  const handleChange = e => {
    debounced(e.target.value)
  }

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase {...props} onChange={handleChange} inputProps={{ 'aria-label': 'search' }} />
    </Search>
  )
}

SearchInput.defaultProps = {
  onChange: () => {},
  fullWidth: true,
}

export default SearchInput
