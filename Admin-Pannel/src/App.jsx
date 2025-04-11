import React from 'react'
import AdminDashboard from './Components/AdminDashboard.jsx'
import {Routes,Route} from 'react-router-dom'
import NotFound from './Components/NotFound'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminDashboard/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </div>
  )
}

export default App
