import React from 'react'
import Navbar from '../components/layout/Navbar'

const WithoutFooterLayout = ({children}) => {
  return (
   <>
   <Navbar/>
   {children}
   </>
  )
}

export default WithoutFooterLayout