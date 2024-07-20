import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Agent } from "./pages/agent/Agent";
import { UserDashboard } from "./pages/message-passing/UserDashboard";
import { AgentDashboard } from "./pages/message-passing/AgentDashboard";
import { Error } from "./pages/Error";
import { ManageRooms } from "./pages/manage-rooms/ManageRooms";
import { AddRoom } from "./pages/manage-rooms/AddRoom";
// import LexChatBot from './pages/lex-bots/LexChatBot'
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import Confirmation from "./pages/authentication/Confirmation";
import {Account} from './pages/authentication/Account'
import Status from "./pages/authentication/Status";
import Verification from "./pages/authentication/Verification";
import { Customer } from "./pages/customer/Customer";
import EditRoom from "./pages/manage-rooms/EditRoom";
import BotRenderer from "./pages/chat-bot/Chat";
import Rooms from "./pages/customer/Rooms";
import MyBookings from "./pages/booking/MyBookings";
import DataAnalysis from "./pages/DataAnalysis";


function App() {
  return (
    <div className="App">
      <BotRenderer/>

      <Account>
      <Status />
      <Router>
        <Routes>
          <Route path='/' exact Component={Home}></Route>
          <Route path='/sign-up' exact Component={Signup}></Route>
          <Route path='/login' exact Component={Login}></Route>
          <Route path='/auth-confirm/:email/:firstName' element={<Confirmation />}></Route>
          <Route path='/verification/:email' Component={Verification}></Route>
          <Route path='/agent' Component={Agent}></Route>
          <Route path='/customer' Component={Customer}></Route>
          <Route path='/customer/submit-query' Component={UserDashboard}></Route>
          <Route path='/agent/answer-query' Component={AgentDashboard}></Route>
          <Route path='/customer/bookings' Component={MyBookings}></Route>
          <Route path='/customer/rooms' Component={Rooms}></Route>
          {/* <Route path="/bot" Component={LexChatBot}></Route> */} //Removed because of Amazon Lex Access issue. Used Dialogflow instead
          <Route path='/manage-rooms' Component={ManageRooms}></Route>
          <Route path='/manage-rooms/add' Component={AddRoom}></Route>
          <Route path='/manage-rooms/edit-room/:roomId' Component={EditRoom}></Route>
          <Route path='/analytics' Component={DataAnalysis}></Route>
          <Route path="*" Component={Error}></Route>

        </Routes>
      </Router>
      </Account>
    </div>
  );
}

export default App;
