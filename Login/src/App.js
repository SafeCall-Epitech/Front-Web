import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import Login from './components/pages/LoginPage'
import Register from './components/pages/RegisterPage'
import ForgetPasswordPage from './components/pages/ForgetPasswordPage'
import HomePage from './components/pages/HomePage'
import TermsPage from './components/pages/TermsPage'
import PrivacyPage from './components/pages/PrivacyPage'


import './App.css'

export default function App() {
    return (
        <Router>
            <div className="App">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forget-password" element={<ForgetPasswordPage />} />
                <Route path="homepage" element={<HomePage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
            </Routes>
            </div>
        </Router>
)
}