import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* Add signup route when component is created */}
        <Route path="/signup" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
