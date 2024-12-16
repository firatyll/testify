import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import NavBar from './components/NavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
