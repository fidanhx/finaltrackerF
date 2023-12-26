// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/Search';
import TrackDetail from './components/TrackDetail';
import AlbumDetail from './components/AlbumDetail';
import ArtistDetail from './components/ArtistDetail';
import SearchResult from './components/SearchResult';
import LikeList from './components/LikeList';
import VideoPlayer from './components/VideoPlayer';
import PlaylistPage from './components/PlayListPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<VideoPlayer />} />
          {/* <Route exact path="/" element={<Search />} /> */}
          <Route path="/track/:id" element={<TrackDetail />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/playlist" element={<PlaylistPage />}/>
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/search-result" element={<SearchResult />} />
          <Route path="/liked-tracks" element={<LikeList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
