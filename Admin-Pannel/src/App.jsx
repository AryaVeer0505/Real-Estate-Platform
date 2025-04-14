import React from 'react'
import AdminDashboard from './Pages/AdminDashboard'
import {Routes,Route} from 'react-router-dom'
import NotFound from './Components/NotFound'
import Properties from './Pages/Properties'
import Users from './Pages/Users'
import Login from './Pages/Login'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminDashboard/>}></Route>
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/properties" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </div>
  )
}

export default App
