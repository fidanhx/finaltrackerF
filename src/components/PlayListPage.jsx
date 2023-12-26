import React, { useState, useEffect } from 'react';
import Search from './Search.jsx'
import { Link } from 'react-router-dom';
import './PlayListPage.css'

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState({}); 
  
  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem('playlists')) || {};
    setPlaylists(storedPlaylists);
  }, []);


  return (
    <div>
      <div className='play-main'>
      <div>
        <Search/>
      </div>
      <div>
     
      <div>
      <div className="like-list-container"> 
      <div className='like-list play-list'>
      {Object.keys(playlists).length > 0 ? (
  Object.keys(playlists).map((playlistName) => (
    <div key={playlistName}>
      <h2 className='likeHeader'>{playlistName}</h2>
      <ul>
      {playlists[playlistName].tracks.map((track) => (
  <li key={track.id}>
    <div className="resultBox">
      <Link
        to={`/track/${track.id}`}
        onClick={(e) => e.stopPropagation()}
        className='s-Li'
      >
        <div key={track.id} className="resultButtonBox">
          <div className='TrackDetails'>
            <p className='trackName'>{track.title || 'Title Not Available'}</p>
            <p className="artistName">{track.artist?.name || 'Artist Not Available'}</p>
          </div>
        </div>
      </Link>
    </div>
  </li>
))}
      </ul>
    </div>
  ))
) : (
  <p className='no-pl'>No playlists available</p>
)}


           </div> 
           </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
