import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use axios for fetching rooms

// RoomCard Component
const RoomCard = ({ room }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-36 object-cover"
        src={room.image}
        alt={room.roomNumber}
      />
      <div className="p-4">
        <h5 className="text-xl font-semibold mb-2">{room.roomNumber}</h5>
        <p className="text-gray-600 mb-4">{room.price}</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Book Now
        </button>
      </div>
    </div>
  );
};

// RoomList Component
const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRoomList = async () => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomList;
