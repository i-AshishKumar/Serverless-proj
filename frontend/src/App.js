import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Agent } from "./pages/agent/Agent";
import { UserDashboard } from "./pages/message-passing/UserDashboard";
import { AgentDashboard } from "./pages/message-passing/AgentDashboard";
import { Booking } from "./pages/booking/Booking";
import { Error } from "./pages/Error";
import { ManageRooms } from "./pages/manage-rooms/ManageRooms";
import { AddRoom } from "./pages/manage-rooms/AddRoom";
import LexChatBot from './pages/lex-bots/LexChatBot'
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import {Account} from './pages/authentication/Account'
import Status from "./pages/authentication/Status";
import RoomList from "./pages/list-rooms/ListRooms";
import EditRoom from "./pages/manage-rooms/EditRoom";

function App() {
  return (
    <div className="App">
      <Account>
      <Status />
      <Router>
        <Routes>
          <Route path='/' exact Component={Home}></Route>
          <Route path='/sign-up' exact Component={Signup}></Route>
          <Route path='/login' exact Component={Login}></Route>
          <Route path='/agent' Component={Agent}></Route>
          <Route path='/customer/submit-query' Component={UserDashboard}></Route>
          <Route path='/agent/answer-query' Component={AgentDashboard}></Route>
          <Route path='/booking' Component={Booking}></Route>
          <Route path="/bot" Component={LexChatBot}></Route>
          <Route path="/list-rooms" Component={RoomList}></Route>
          <Route path='/manage-rooms' Component={ManageRooms}></Route>
          <Route path='/manage-rooms/add' Component={AddRoom}></Route>
          <Route path='/manage-rooms/edit-room/:roomId' Component={EditRoom}></Route>
          <Route path="*" Component={Error}></Route>

        </Routes>
      </Router>
      </Account>
    </div>
  );
}

export default App;
