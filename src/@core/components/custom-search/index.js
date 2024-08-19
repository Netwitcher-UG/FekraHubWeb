import React, { useState } from 'react'
import styled from '@emotion/styled'
import InputBase from '@mui/material/InputBase'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,

  backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#F1F1F1',
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

export default function CustomSearch({ SetSearch, value, handleSearch, inTable = false }) {
  const handleChange = event => {
    SetSearch(event.target.value)
  }

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
        <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2.05}
            d='M17.5 17.5L22 22m-2-11a9 9 0 1 0-18 0a9 9 0 0 0 18 0'
            color='currentColor'
          ></path>
        </svg>
      </SearchIconWrapper>
      {inTable ? (
        <StyledInputBase
          value={value}
          placeholder='search'
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleSearch}
        />
      ) : (
        <StyledInputBase placeholder='search' inputProps={{ 'aria-label': 'search' }} onChange={handleChange} />
      )}
    </Search>
  )
}
