import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home';
import Announcement from './components/Announcement';
import Emergency from './components/Emergency/Emergency'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Announcement" element={<Announcement />} />
        <Route path="/Emergency" element={<Emergency />} />

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;