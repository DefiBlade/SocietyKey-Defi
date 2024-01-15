import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './component/navbar';
import Home from './page/home';
import About from './page/about';
import Contact from './page/contact';
import Faq from './page/faq';

import './css/App.scss';

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/societykey' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/faq' element={<Faq />} />
      </Routes>
    </Router>
  );
}
