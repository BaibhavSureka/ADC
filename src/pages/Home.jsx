import React from 'react';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import TestimonialCard from '../components/TestimonialCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredEvents = [
    { 
      title: 'Mental Health Awareness Workshop', 
      date: 'June 15, 2023', 
      description: 'Join us for an interactive workshop on mental health awareness.', 
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
    },
    { 
      title: 'Stress Management Seminar', 
      date: 'July 2, 2023', 
      description: 'Learn effective techniques for managing stress in your daily life.', 
      image: 'https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' 
    },
  ];

const testimonials = [
  { 
    name: "John Doe", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", 
    testimonial: "ADC has been a life-changing experience for me. I've learned so much about mental health and self-care." 
  },
  { 
    name: "Jane Smith", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", 
    testimonial: "The support I've received from the ADC community is incredible. I feel more empowered than ever." 
  }
];


  return (
    <div>
      <Hero />
      <div className="container mx-auto px-6 py-12">
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">About ADC</h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto text-center leading-relaxed">
            ADC (Awareness, Development, and Care) is dedicated to promoting mental health awareness and providing support to our community. We believe in creating a safe space for individuals to learn, grow, and care for their mental well-being.
          </p>
        </section>
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </section>
        <section className="mb-20 bg-gray-100 py-16 rounded-lg">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </section>
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/events" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">Events</Link>
            <Link to="/resources" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">Resources</Link>
            <Link to="/about" className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">Join Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;