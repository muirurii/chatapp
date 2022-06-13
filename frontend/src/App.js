import{BrowserRouter,Route,Routes} from 'react-router-dom';
import { useState } from 'react';
import Chat from './pages/Chat';
import Join from './pages/Join';

function App() {
  const[error,setError] = useState('');
  const resetError = (payload)=> setError(payload);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Join error={error}/>} />
        <Route path='/chat/:name/:room' element={<Chat resetError={resetError} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
