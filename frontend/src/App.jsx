import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CandidateReg from './components/CandidateReg';
import ElectionCommitteeRole from './components/ElectionCommitteeRole';
import Navbar from './components/Navbar';
import ResultsMonitoring from './components/resultsMonitoring';
import VoterReg from './components/voterReg';
import LoginPage from './components/Loginpage';

function App() {
  return (
    <>
      <Navbar  title=" vote for ricr"/>
      <ElectionCommitteeRole/>
      <Routes>
        <Route path="/Candidate" element={<CandidateReg />} />
        <Route path="/Committee" element={<ElectionCommitteeRole />} />
        <Route path="/Results" element={<ResultsMonitoring />} />
        <Route path="/Voter" element={<VoterReg />} />
        <Route path="/login" element={<LoginPage/>} />
        {/* Add default/fallback route if needed */}
        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
