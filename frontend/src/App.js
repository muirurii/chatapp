import{BrowserRouter,Route,Routes} from 'react-router-dom';
import Chat from './pages/Chat';
import Join from './pages/Join';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Join />} />
        <Route path='/chat/:name/:room' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
