import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // For admin check

  useEffect(() => {
    fetchAnnouncements();
    checkAdminStatus();
    gsap.from('.announcement-item', { opacity: 0, y: 20, duration: 1, stagger: 0.2 });
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Replace with your API endpoint
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  };

  const checkAdminStatus = () => {
    // Replace with actual admin check logic
    const userIsAdmin = true; // Dummy check
    setIsAdmin(userIsAdmin);
  };

  const handleAddAnnouncement = () => {
    // Logic to add a new announcement
    alert('Add new announcement (Admin only)');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-white font-sans">
      <h1 className="text-4xl text-center mb-8 text-teal-400">📢 Announcements</h1>
      {isAdmin && (
        <button
          className="block mx-auto mb-6 px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-500 transition-colors duration-300"
          onClick={handleAddAnnouncement}
        >
          Add Announcement
        </button>
      )}
      <div className="grid gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="announcement-item p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl mb-2 text-teal-400">{announcement.title}</h2>
            <p className="text-gray-300 mb-4">{announcement.description}</p>
            <small className="text-gray-500">{announcement.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;