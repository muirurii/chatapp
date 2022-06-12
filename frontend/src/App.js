import{BrowserRouter,Route,Routes} from 'react-router-dom';
import { useState } from 'react';
import Chat from './pages/Chat';
import Join from './pages/Join';

function App() {
  const[error,setError] = useState('err');
  const resetError = (payload)=> setError(payload);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' eror={error} element={<Join />} />
        <Route path='/chat/:name/:room' props={resetError} element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
