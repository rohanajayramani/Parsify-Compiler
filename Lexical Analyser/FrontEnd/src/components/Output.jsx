import React from 'react'
import { Box } from '@mui/material'

const Output = ({values}) => {
    let outputItems = []
    for(let i=0;i<values.length;i++){
      outputItems.push(<li key={i}>{values[i].type}: {values[i].value}</li>)
    }

  return (
    <Box className='editor-container'>
      <div className='outputText' >{outputItems}</div>
    </Box>
  )
}

export default Output