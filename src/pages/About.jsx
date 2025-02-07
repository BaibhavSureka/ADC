import React from 'react';
import TeamMember from '../components/TeamMember';

const teamMembers = [
  { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'path/to/sarah.jpg', bio: 'Sarah has been passionate about mental health awareness for over a decade.' },
  { name: 'Michael Lee', role: 'Head of Programs', image: 'path/to/michael.jpg', bio: 'Michael brings years of experience in developing effective mental health programs.' },
  { name: 'Emily Chen', role: 'Community Outreach Coordinator', image: 'path/to/emily.jpg', bio: 'Emily is dedicated to building strong connections within the community.' },
];

const About = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About ADC</h1>

      {/* Mission Section */}
      <section className="bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
        <p className="text-gray-700 text-lg text-center">
          At ADC (Awareness, Development, and Care), our mission is to promote mental health awareness, provide support, and foster a community of care and understanding.
        </p>
      </section>

      {/* Team Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
