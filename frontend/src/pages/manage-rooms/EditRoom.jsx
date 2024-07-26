import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditRoom = () => {
  // Retrieve state passed through the location object
  const { state } = useLocation();
  const roomId  = state.room.id; // Get room ID from state
  const navigate = useNavigate();
  
  // Initialize room state with data from location state or default values
  const [room, setRoom] = useState(state?.room || {
    roomNumber: '',
    price: '',
    rating: 0,
    location: '',
    beds: 0,
    guests: 0,
    baths: 0,
  });

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make a POST request to update room data
      const response = await axios.post(
        `https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/edit-room?roomId=${roomId}`, 
        room, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Navigate to manage rooms page if update is successful
      if (response.status === 200) {
        navigate("/manage-rooms");
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      // Handle any errors during the update
      console.error('Error updating room:', error);
    }
  };

  return (
    <div className="container mx-auto my-4 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Room</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="text"
              name="roomNumber"
              id="roomNumber"
              value={room.roomNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              value={room.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              value={room.rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={room.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
              Beds
            </label>
            <input
              type="number"
              name="beds"
              id="beds"
              value={room.beds}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Guests
            </label>
            <input
              type="number"
              name="guests"
              id="guests"
              value={room.guests}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
              Baths
            </label>
            <input
              type="number"
              name="baths"
              id="baths"
              value={room.baths}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
