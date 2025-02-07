import React from 'react';
import TestimonialCard from '../components/TestimonialCard';
import BlogPost from '../components/BlogPost';

const TestimonialsAndBlogs = () => {
  const testimonials = [
  { 
    name: "John Doe", 
    image: "path/to/john.jpg", 
    testimonial: `ADC has been a life-changing experience for me. 
    I've learned so much about mental health and self-care.` 
  },
  { 
    name: "Jane Smith", 
    image: "path/to/jane.jpg", 
    testimonial: `The support I've received from the ADC community is incredible. 
    I feel more empowered than ever.` 
  },
    { name: 'Alex Johnson', image: 'path/to/alex.jpg', testimonial: 'The workshops and events organized by ADC have given me valuable tools to manage my anxiety.' },
  ];

  const blogPosts = [
  { 
    title: "Understanding Anxiety: Causes and Coping Strategies", 
    author: "Dr. Emily Chen", 
    date: "May 15, 2023", 
    image: "path/to/blog1.jpg", 
    excerpt: "Anxiety is a common mental health concern that affects millions of people worldwide..."
  },
  { 
    title: "The Importance of Self-Care in Mental Health", 
    author: "Sarah Johnson", 
    date: "June 1, 2023", 
    image: "path/to/blog2.jpg", 
    excerpt: "Self-care is not just a buzzword; it\'s an essential practice for maintaining good mental health..."
  },
  { 
    title: "Breaking the Stigma: Mental Health in the Workplace", 
    author: "Michael Lee", 
    date: "June 10, 2023", 
    image: "path/to/blog3.jpg", 
    excerpt: "Mental health issues in the workplace are more common than you might think..."
  }
];
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Submit Your Story
          </button>
        </div>
      </section>
      <section>
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsAndBlogs;