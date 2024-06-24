import React, { useEffect, useState } from "react";
import { getRooms } from "../api/getRooms";
import RoomCard from "../components/RoomCard";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRoomList = async () => {
      const res = await getRooms();
      setRooms(res);
    };
    getRoomList();
  }, []);

  console.log(rooms);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="w-full">
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;