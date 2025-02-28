import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Protected from "./Components/Protected";
import ChangePassword from "./Components/ChangePassword";
import Friends from "./Components/Friends";
import InviteFriends from "./Components/InviteFriends";
import Preferences from "./Components/Preferences";
import Profile from "./Components/Profile";
import NotFound from "./Components/NotFound";
import CreateWaves from "./Components/CreateWaves";
import Dashboard from "./Components/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Signup />}></Route>
                    <Route exact path="/login" element={<Login />}></Route>

                    <Route
                        exact
                        path="/user/:id"
                        element={<Protected Component={Dashboard} />}
                    ></Route>
                    <Route
                        exact
                        path="/user/:id/profile"
                        element={<Protected Component={Profile} />}
                    ></Route>

                    <Route
                        exact
                        path="/user/:id/friends"
                        element={<Protected Component={Friends} />}
                    ></Route>
                    <Route
                        exact
                        path="/user/:id/friends/invite"
                        element={<Protected Component={InviteFriends} />}
                    ></Route>

                    <Route
                        exact
                        path="/user/:id/change-password"
                        element={<Protected Component={ChangePassword} />}
                    ></Route>
                    <Route
                        exact
                        path="/user/:id/preferences"
                        element={<Protected Component={Preferences} />}
                    ></Route>
                    <Route
                        exact
                        path="/user/:id/waves"
                        element={<Protected Component={CreateWaves} />}
                    ></Route>

                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
