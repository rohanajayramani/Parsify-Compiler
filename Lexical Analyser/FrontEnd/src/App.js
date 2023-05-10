import React, { useState } from 'react'
import { Compiler,Home } from './components/index.js'
import Footer from './components/Footer.jsx'

const App = () => {
  const [logStat, setLogStat] = useState()
  if(logStat===false){
    return(<Home value={logStat} onChange={setLogStat} ></Home>)
  }else{
    return(
      <>
    <Compiler>
    </Compiler>
    <Footer/>
    </>
    )
  }
}
export default App