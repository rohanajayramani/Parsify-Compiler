import React, { useState } from 'react'
import { Editor, Navbar, Output } from './index.js'
import { Box } from '@mui/system'
import Footer from './Footer'

const Compiler = () => {
  const [program, setProgram] = useState('//Write your code here');
  const [outputCode,setoutputCode] = useState('');

  const getOutput=(data)=>{
    setoutputCode(data)
  }
  return (
    <>
  <Navbar
    value={program}
    onChange={getOutput}
  />
  <Box display='flex'>
  <Editor
    value={program}
    onChange={setProgram}
  />
  <Output
    values={outputCode}
  />
  
  </Box>
  </>
  )
}
export default Compiler