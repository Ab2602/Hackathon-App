import './App.css'
//import React from 'react'
import MainPage from './components/MainPage'
import CreateChallenge from "./components/CreateChallenge";
import ChallengeDetail from './components/ChallengeDetails';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import EditDetails from './components/EditDetails';
function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/create" element={<CreateChallenge />} />
        <Route path="/challenge/:id" element={<ChallengeDetail />} />
        <Route path="/edit-challenge/:id" element={<EditDetails />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
