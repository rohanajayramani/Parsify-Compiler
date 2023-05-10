import React from 'react'
import { AppBar, Fab, Toolbar } from '@mui/material'
import { Terminal } from '@mui/icons-material';
import { Box } from '@mui/system'
import './Navbar.css' 

const Navbar = ({value, onChange}) => {
// http://localhost:3001/auth/output
  function handleClick(){
    fetch('https://charming-dungarees-seal.cyclic.app/auth/output', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({input: value})
    }).then((res) => {
      res.json().then((resp)=>{
        console.log(resp.outputCode)
        onChange(resp.outputCode)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <Box className='topBar-container '>
    <AppBar position='static' className='top-bar navbar'>
   
        <Toolbar className='toolbar navbar'>
        <h1>Lexical Analyzer</h1>

        <Fab variant='extended' size='small' onClick={handleClick}>
            <Terminal sx={{mr:1}} />
            Run
        </Fab>
        
        </Toolbar>
    </AppBar>
    </Box>
  )
}

export default Navbar