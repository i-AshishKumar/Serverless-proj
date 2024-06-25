import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoomList = async () => {
      // const res = await getRooms();
      setRooms([
        {
          id: 1,
          image: "/image1.jpg",
          roomNumber: "3366",
          price: "$100",
          rating: 2,
          location: "Halifax",
          beds: 2,
          guests: 2,
          baths: 2,
        },
        {
          id: 2,
          image: "/path/to/image2.jpg",
          roomNumber: "3367",
          price: "$170",
          rating: 4,
          location: "Toronto",
          beds: 1,
          guests: 1,
          baths: 1,
        },
      ]);
    };
    getRoomList();
  }, []);

  const handleDelete = async (id) => {
    // Delete logic here
  };

  const handleEdit = (id) => {
    // Edit logic here
  };

  const handleAddRoom = () => {
    navigate("/manage-rooms/add");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded my-5">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Room ID</th>
              <th className="py-3 px-6 text-left">Image</th>
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
                <td className="py-3 px-6 text-left whitespace-nowrap">{room.id}</td>
                <td className="py-3 px-6 text-left">{room.image}</td>
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
                    onClick={() => handleEdit(room.id)}
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