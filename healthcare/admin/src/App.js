import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./Components/Protected";
import NotFound from "./Components/NotFound";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Signup />}></Route>
                    <Route exact path="/login" element={<Login />}></Route>

                    <Route
                        exact
                        path="/admin/:id"
                        element={<Protected Component={Dashboard} />}
                    ></Route>

                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
