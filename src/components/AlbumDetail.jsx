import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Search from './Search';
import './AlbumDetail.css'

const AlbumDetail = () => {
  const { id } = useParams();
  const [albumDetail, setAlbumDetail] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);

  useEffect(() => {
    const storedLikedTracks = localStorage.getItem('likedTracks');
    if (storedLikedTracks) {
      setLikedTracks(JSON.parse(storedLikedTracks));
    }
  }, []);
  
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      const options = {
        method: 'GET',
        url: `https://deezerdevs-deezer.p.rapidapi.com/album/${id}`,
        headers: {
          'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        setAlbumDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbumDetail();
  }, [id]);

  if (!albumDetail) {
    return <div>Loading...</div>;
  }

  
  const handleLikeButtonClick = (trackId) => {
    const isLiked = likedTracks.some((track) => track.id === trackId);

    if (isLiked) {
      const newLikedTracks = likedTracks.filter((track) => track.id !== trackId);
      setLikedTracks(newLikedTracks);
      localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks));
    } else {
      const trackToLike = albumDetail.tracks.data.find((track) => track.id === trackId);
      if (trackToLike) {
        setLikedTracks([...likedTracks, trackToLike]);
        localStorage.setItem('likedTracks', JSON.stringify([...likedTracks, trackToLike]));
      }
    }
  };

  return (
    <div className='album-all'>
      <div>
      <Search/>
      </div>
      <div className='album-main'>
        <div className='album-oneP'>
          <h3 className='album-ttlM album-ttl2'>Album: {albumDetail.title}</h3>
          <div className='artist-box alb-artistB'>
            <img className='artist-img' src={albumDetail.artist.picture_big} alt="Album Cover" />
          </div>
          <Link className='s-Li2' to={`/artist/${albumDetail.artist.id}`}>
            <p className='album-ttlArt'>Artist: {albumDetail.artist.name}</p>
          </Link>
        </div>
        <div className="like-list album-twoP">
          <h3 className="likeHeader">Tracks:</h3>
          <ul>
            {albumDetail.tracks.data.length === 0 && <p className='no-track'>Not found.</p>}
            {albumDetail.tracks.data.map((track) => (
            <li key={track.id}>
              <div key={track.id} className="resultBox alb-box search-result-item ">
                <Link to={`/track/${track.id}`} className='s-Li' >
                  <div key={track.id} className="resultButtonBox">
                    <img src={track.album.cover_small} alt="Track Cover" />
                    <div className='TrackDetails'>
                      <p className='trackName'>{track.title}</p>
                    </div>
                  </div>
                </Link>
                <label className="like-container5">
                  <input
                  type="checkbox"
                  checked={likedTracks.some((likedTrack) => likedTrack.id === track.id)}
                  onChange={() => handleLikeButtonClick(track.id)}
                  />
                  <div className="checkmark5">
                    <svg viewBox="0 0 256 256">
                      <rect fill="none" height="256" width="256"></rect>
                      <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path>
                    </svg>
                  </div>
                </label>
              </div>
              {track.preview && (
              <div className="music-player music-in-alb">
                <audio className='audio-m' controls>
                  <source src={track.preview} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            </li>
        ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
