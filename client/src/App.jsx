import './App.css'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'

import Login from './pages/Login/Login'
import './assets/css/AllStyles.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage'
import Courses from './pages/Courses';
import About from './pages/About';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Vision from './pages/Vision';
import AdminPage from './pages/AdminPage';
import CourseDetail from './pages/CourseDetail';
import AuthSuccess from './components/AuthSuccess';

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>                                
          <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <h1>Welcome to the protected page!</h1>
            </ProtectedRoute>
          }
        />
          <Route path='/about' element={<About/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/vision' element={<Vision/>}/>
          <Route path="/admin" element={<AdminPage />} />
          <Route path='/my-courses' element={<Courses/>}/>
          <Route path='/course-details/:id' element={<CourseDetail/>}/>
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
        </Router>
    </>
  )
}

export default App
