import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import styled from '@emotion/styled'
import InputBase from '@mui/material/InputBase'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,

  backgroundColor: '#F1F1F1',
  maxWidth: '432px',

  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch'
    }
  }
}))

export default function CustomSearch({ onSearch }) {
  return (
    <Search
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase placeholder='search' inputProps={{ 'aria-label': 'search' }} />
    </Search>
  )
}
