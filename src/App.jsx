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
import CrearPublicacion from './components/pages/CrearPublicaion/CrearPublicacion.jsx';
import Loading from './components/Loading/Loading.jsx'; // 💡 Importa el nuevo loader
import Rutinas from './components/pages/Entrenamiento/components/Modulos/Rutinas/Rutinas.jsx';
import Datos from './components/pages/Perfil/modulos/Datos/Datos.jsx';
import { UsuarioProvider } from './context/UsuarioContext.jsx';
import { usePublicaciones } from './hooks/usePublicaiones.js';

function AppWrapper() {
  return (
    <Router>
      <UsuarioProvider>
        <App />
      </UsuarioProvider>
    </Router>
  );
}

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isChatWindow = location.pathname.startsWith('/chat/') && location.pathname !== '/chat';

  if (loading) return <Loading />; // 🎯 Nuevo loader aplicado

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
              <Route path="/admin" element={<CrearPublicacion />} />
            ) : (
              <>
                <Route path="/entrenamiento" element={<Entrenamiento />} />
                <Route path="/entrenamiento/rutinas" element={<Rutinas />} />

                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/datos" element={<Datos />} />
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
