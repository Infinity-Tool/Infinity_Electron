import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Hello from './Sample/Sample';
import Welcome from './Welcome/Weclome';

export default function App() {
  return (
    <Router>
      {/* <Routes><Route path="/" element={<Hello />} /></Routes> */}
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
}
