import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ Import Routes instead of Switch
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import TestimonialsAndBlogs from './pages/TestimonialsAndBlogs';
import Resources from './pages/Resources';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes> {/* ✅ Use Routes instead of Switch */}
            <Route path="/" element={<Home />} /> {/* ✅ Use element={} instead of component={} */}
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials-blogs" element={<TestimonialsAndBlogs />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
