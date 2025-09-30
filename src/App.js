import { Route, Routes } from 'react-router-dom';
import './index.css'
import Main from './components/Main';
import Frontend from './components/Frontend';

function App() {
  return (
    <div className="App overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Main/>} />
         <Route path="/frontend" element={<Frontend/>} />
      </Routes>
    </div>
  );
}

export default App;



