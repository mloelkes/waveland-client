import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Player from "./components/Player";
import Waves from "./pages/Waves";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [trackUrl, setTrackUrl] = useState("");
    const [trackImage, setTrackImage] = useState("");
    const [trackName, setTrackName] = useState("");
    const [artistName, setArtistName] = useState("");

    function handlePlayTrack(trackUrl, trackImage, trackName, artistName) {
        setTrackUrl(trackUrl);
        setTrackImage(trackImage);
        setTrackName(trackName);
        setArtistName(artistName);
    }

    return (
        <div className="App">
            <Navigation></Navigation>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute redirectTo='/login'>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/upload" element={
                    <ProtectedRoute redirectTo='/login'>
                        <Upload />
                    </ProtectedRoute>
                } />
                <Route path="/waves" element={
                    <ProtectedRoute redirectTo='/login'>
                        <Waves handlePlayTrack={handlePlayTrack}/>
                    </ProtectedRoute>
                } />
                <Route path="/:nameForUrl" element={
                    <ProtectedRoute redirectTo='/login'>
                        <Profile handlePlayTrack={handlePlayTrack}/>
                    </ProtectedRoute>
                } />
            </Routes>
            <Player trackUrl={trackUrl} trackImage={trackImage} trackName={trackName} artistName={artistName}></Player>
        </div>
    );
}

export default App;
