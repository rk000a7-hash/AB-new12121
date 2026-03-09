import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';

function App() {
  const PrivateRoute = ({ children }) => {
    return localStorage.getItem('token') ? (
      <>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
