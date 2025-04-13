import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home/Home.jsx';
import ChatList from './components/pages/Chat/ChatList.jsx';
import ChatWindow from './components/pages/Chat/ChatWindow.jsx'; 
import Entrenamiento from './components/pages/Entrenamiento/Entrenamiento.jsx';
import Perfil from './components/pages/Perfil/Perfil.jsx';
import AuthGate from './components/AuthGate/AuthGate';
import AdminPanel from './components/pages/AdminPanel/AdminPanel';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="app-loading">Cargando...</div>;

  return (
    <Router>
      {!user ? (
        <AuthGate />
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:chatId" element={<ChatWindow />} />

            {user?.role === 'admin' ? (
              <Route path="/admin" element={<AdminPanel />} />
            ) : (
              <>
                <Route path="/entrenamiento" element={<Entrenamiento />} />
                <Route path="/perfil" element={<Perfil />} />
              </>
            )}
            {/* Ruta de catch-all para evitar errores */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Navbar />
        </>
      )}
    </Router>
  );
}

export default App;