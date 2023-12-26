import React, { useEffect, useState } from 'react';
import Search from './Search';
import './LikeList.css';
import { Link } from 'react-router-dom';

const LikeList = () => {
  const [likedTracks, setLikedTracks] = useState([]);

  useEffect(() => {
    const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
    setLikedTracks(storedLikedTracks);
  }, []);

  const handleLikeButtonClick = (id) => {
    const isLiked = likedTracks.some((track) => track.id === id);
  
    let updatedLikedTracks = [];
    if (isLiked) {
      updatedLikedTracks = likedTracks.filter((track) => track.id !== id);
    } else {
      const likedTrack = likedTracks.find((track) => track.id === id);
      updatedLikedTracks = [...likedTracks, likedTrack];
    }
  
    setLikedTracks(updatedLikedTracks);
    localStorage.setItem('likedTracks', JSON.stringify(updatedLikedTracks));
  };
  
  
  

  const handleTrackClick = (event, id) => {
    const clickedElement = event.target || event.srcElement;
  
    if (!clickedElement || !clickedElement.classList || !clickedElement.classList.contains) {
      return;
    }
  
    if (clickedElement.classList.contains('like-container3')) {
      return;
    }
  
    const updatedLikedTracks = likedTracks.filter((track) => track.id !== id);
    setLikedTracks(updatedLikedTracks);
    localStorage.setItem('likedTracks', JSON.stringify(updatedLikedTracks));
  };
  
  return (
    <div className='like-main'>
      <div>
        <Search />
      </div>
      <div className="like-list-container">
       <div className="like-list">
        <h3 className="likeHeader">Liked Tracks</h3>
        {likedTracks.length === 0 && <p className='no-track'>No liked tracks yet.</p>}
        {likedTracks.map((track) => (
        <div className="resultBox search-result-item" key={track.id}>
          <Link to={`/track/${track.id}`} onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none' }}>
            <div className="resultButtonBox" onClick={() => handleTrackClick(track.id)}>
              <img src={track.album.cover_small} alt="Track Cover" />
              <div className="TrackDetails">
                <p className="trackName">{track.title}</p>
                <p className="artistName">{track.artist.name}</p>
              </div>
            </div>
          </Link>
          <label className="like-container3" >
            <input type="checkbox" checked={likedTracks.some((likedTrack) => likedTrack.id === track.id)} readOnly onClick={() => handleLikeButtonClick(track.id)}/>
            <div className="checkmark3">
              <svg viewBox="0 0 256 256">
                <rect fill="none" height="256" width="256"></rect>
                <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path>
              </svg>
            </div>
          </label>
        </div>
        ))}
       </div>
      </div>
    </div>
  );
};

export default LikeList;
