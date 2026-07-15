import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const PanditLayout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>

  )
}

export default PanditLayout