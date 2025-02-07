import React, { useState } from 'react';
import EventCard from '../components/EventCard';

const Events = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    { title: 'Mental Health Awareness Workshop', date: 'June 15, 2023', description: 'Join us for an interactive workshop on mental health awareness.', image: 'path/to/event1.jpg', type: 'upcoming' },
    { title: 'Stress Management Seminar', date: 'July 2, 2023', description: 'Learn effective techniques for managing stress in your daily life.', image: 'path/to/event2.jpg', type: 'upcoming' },
    { title: 'Mindfulness Retreat', date: 'May 10, 2023', description: 'A day-long retreat focused on mindfulness and meditation practices.', image: 'path/to/event3.jpg', type: 'past' },
    { title: 'Anxiety Support Group', date: 'April 5, 2023', description: 'A supportive environment for individuals dealing with anxiety.', image: 'path/to/event4.jpg', type: 'past' },
  ];

  const filteredEvents = events.filter(event => 
    (filter === 'all' || event.type === filter) &&
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Events;