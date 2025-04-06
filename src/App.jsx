import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home/Home.jsx';
import Chat from './components/pages/Chat/Chat.jsx';  
import Entrenamiento from './components/pages/Entrenamiento/Entrenamiento.jsx';
import Perfil from './components/pages/Perfil/Perfil.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/entrenamiento" element={<Entrenamiento />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Navbar />
    </Router>
  );
}

export default App;