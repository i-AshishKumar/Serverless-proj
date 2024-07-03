import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ManageRooms = () => {
	const [rooms, setRooms] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const getRoomList = async () => {
			try {
				const res = await axios.get('https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/get-rooms');
				setRooms(res.data);
			} catch (error) {
				console.error('Error fetching rooms:', error);
			}
		};
		getRoomList();
	}, []);

	const handleDelete = async (id) => {
		try {
			const url = `https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/delete-room?roomId=${id}`;
			await axios.post(url).then(async (res) => {
				const response = await axios.get('https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/get-rooms');
				setRooms(response.data);
			});
			
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = (room) => {
		navigate(`/manage-rooms/edit-room/${room.id}`, { state: { room } });
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
							{/* <th className="py-3 px-6 text-left">Room ID</th> */}
							{/* <th className="py-3 px-6 text-left">Image</th> */}
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
								{/* <td className="py-3 px-6 text-left whitespace-nowrap">{room.id}</td> */}
								{/* <td className="py-3 px-6 text-left">{room.image}</td> */}
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