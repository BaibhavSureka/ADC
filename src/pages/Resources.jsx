import React from 'react';
import ResourceCard from '../components/ResourceCard';

const Resources = () => {
  const resources = [
    { title: 'Mental Health Self-Assessment', description: 'Take our interactive quiz to assess your current mental well-being.', link: '#' },
    { title: 'Mindfulness Exercises', description: 'Explore a collection of mindfulness exercises to reduce stress and anxiety.', link: '#' },
    { title: 'Crisis Helplines', description: 'Find emergency contact numbers and support organizations for immediate help.', link: '#' },
    { title: 'Self-Care Guide', description: 'Learn practical tips and strategies for maintaining good mental health.', link: '#' },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Mental Health Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Emergency Contacts</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>National Suicide Prevention Lifeline: 1-800-273-8255</li>
          <li>Crisis Text Line: Text HOME to 741741</li>
          <li>National Domestic Violence Hotline: 1-800-799-7233</li>
        </ul>
      </section>
    </div>
  );
};

export default Resources;