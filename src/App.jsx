import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home/Home.jsx';
import ChatList from './components/pages/Chat/ChatList.jsx';
import ChatWindow from './components/pages/Chat/ChatWindow/ChatWindow.jsx'; 
import Entrenamiento from './components/pages/Entrenamiento/Entrenamiento.jsx';
import Perfil from './components/pages/Perfil/Perfil.jsx';
import AuthGate from './components/AuthGate/AuthGate';
import AdminPanel from './components/pages/AdminPanel/AdminPanel';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const { user, loading } = useAuth();
  const location = useLocation(); // ✅

  const isChatWindow = location.pathname.startsWith('/chat/') && location.pathname !== '/chat';

  if (loading) return <div className="app-loading">Cargando...</div>;

  return (
    <>
      {!user ? (
        <AuthGate />
      ) : (
        <>
          {!isChatWindow && <Header />}
          
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
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {!isChatWindow && <Navbar />}
        </>
      )}
    </>
  );
}

export default AppWrapper;
