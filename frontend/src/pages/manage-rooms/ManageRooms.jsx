import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();

  // Fetch room list when component mounts
  useEffect(() => {
    const getRoomList = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await axios.get('https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/get-rooms');
        setRooms(res.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching rooms:', error); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    getRoomList();
  }, []);

  // Handle delete room action
  const handleDelete = async (id) => {
    try {
      await axios.post(`https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/delete-room?roomId=${id}`);
      // Fetch updated list of rooms after deletion
      const response = await axios.get('https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/get-rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error deleting room:', error); // Handle errors
    }
  };

  // Handle edit room action
  const handleEdit = (room) => {
    navigate(`/manage-rooms/edit-room/${room.id}`, { state: { room } });
  };

  // Navigate to add room page
  const handleAddRoom = () => {
    navigate("/manage-rooms/add");
  };

  return (
    <div className="container mx-auto px-4">
      {loading ? ( // Conditional rendering based on loading state
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded my-5">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Room Number</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Rating</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Beds</th>
                <th className="py-3 px-6 text-left">Guests</th>
                <th className="py-3 px-6 text-left">Baths</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{room.roomNumber}</td>
                  <td className="py-3 px-6 text-left">{room.price}</td>
                  <td className="py-3 px-6 text-left">{room.rating}</td>
                  <td className="py-3 px-6 text-left">{room.location}</td>
                  <td className="py-3 px-6 text-left">{room.beds}</td>
                  <td className="py-3 px-6 text-left">{room.guests}</td>
                  <td className="py-3 px-6 text-left">{room.baths}</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(room)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddRoom}
        >
          Add Room
        </button>
      </div>
    </div>
  );
};
