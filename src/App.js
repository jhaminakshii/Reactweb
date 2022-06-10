
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Notestate from './context/Notestate';
import Alert from './components/Alert';
import LogIn from './components/LogIn';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [alert,setAlert] = useState(null);
  const showAlert = (message,type) => {
    setAlert({ msz: message, type: type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  return (
    <>
      <Notestate>
        <Router>
          <NavBar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert}/>}></Route>
              <Route exact path="/about" element={<About />}></Route>
              <Route exact path="/login" element={<LogIn showAlert={showAlert}/>}></Route>
              <Route exact path="/signup" element={<Signup showAlert={showAlert}/>}></Route>
            </Routes>
          </div>
        </Router>
      </Notestate>
    </>
  );
}

export default App;
