import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './TrackDetail.css'
import Search from './Search';

const TrackDetail = () => {
  const { id } = useParams();
  const [trackDetail, setTrackDetail] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showAlbumContent, setShowAlbumContent] = useState(false);
  const [likedTracks, setLikedTracks] = useState([]);

  useEffect(() => {
    const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
    setLikedTracks(storedLikedTracks);
 }, []);

  useEffect(() => {
    const fetchTrackDetail = async () => {
      try {
        const response = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${id}`, {
          headers: {
            'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        });

        setTrackDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrackDetail();
  }, [id]);



  const fetchAlbumTracks = async () => {
    const album_id = trackDetail.album.id;
    const options = {
      method: 'GET',
      url: `https://deezerdevs-deezer.p.rapidapi.com/album/${album_id}`,
      headers: {
        'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
      },
    };
  
    try {
      const response = await axios.request(options);
      setAlbumTracks(response.data.tracks.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleAlbumButtonClick = () => {
    if (!showAlbumContent) {
      fetchAlbumTracks();
    }
    setShowAlbumContent((prev) => !prev);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };
  useEffect(() => {
    const fetchTrackDetail = async () => {
      try {
        const response = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${id}`, {
          headers: {
            'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        });

        setTrackDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrackDetail();
  }, [id]);

  if (!trackDetail) {
    return <div className='loading'>Loading...</div>;
  }

  const currentTrack = albumTracks[currentTrackIndex];


  const handleLikeButtonClick = () => {
    const isLiked = likedTracks.some((track) => track.id === trackDetail.id);

    if (isLiked) {
      const newLikedTracks = likedTracks.filter((track) => track.id !== trackDetail.id);
      setLikedTracks(newLikedTracks);
      localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks));
    } else {
      const updatedLikedTracks = [...likedTracks, trackDetail];
      setLikedTracks(updatedLikedTracks);
      localStorage.setItem('likedTracks', JSON.stringify(updatedLikedTracks));
    }
  };


  return (
    <div className='whole'>
      <div>
        <Search/>
      </div>
      <div className='all-art'>
       <div className='one-art'>
          <div className='artist-box'>
            <img className='artist-img' src={trackDetail.artist.picture_big} alt="Artist" />
          </div>
          <Link  style={{ textDecoration: 'none' }} to={`/artist/${trackDetail.artist.id}`}>
            <p className='artist-nm'>{trackDetail.artist.name}</p>
          </Link>
       </div>
       <div className='two-all'>
        <div className='two-middle'>
          <div className="track-container">
            <ul>
              <li>
                <div className="resultBox resultBox-t">
                  <img src={trackDetail.album.cover_small} alt="Track Cover" />
                  <div className='TrackDetails'>
                    <p className='trackName'>{trackDetail.title}</p>
                    <p className="artistName">{trackDetail.artist.name}</p>
                  </div>
                  <div className="likeContainerWrapper4">
                    <label className="like-container4">
                      <input
                      type="checkbox"
                      checked={likedTracks.some((likedTrack) => likedTrack.id === trackDetail.id)}
                      readOnly
                      onClick={() => handleLikeButtonClick(trackDetail.id)}
                      />
                      <div className="checkmark4">
                        <svg viewBox="0 0 256 256">
                          <rect fill="none" height="256" width="256"></rect>
                          <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path>
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          <div className='audio-and-time'>
            {trackDetail && trackDetail.preview && (
            <div className="music-player">
              <audio controls>
                <source src={trackDetail.preview} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          </div>
        </div>
        </div>
        <div className='two-two-art'>
         <button  className='album-ttl-btn' onClick={handleAlbumButtonClick}>
          <div className='album-box'>
            <p className='Album-title'>ALBUM</p>
            {showAlbumContent ? '︿' : '﹀'}
          </div>
         </button>
        {showAlbumContent && albumTracks.length > 0 && (
        <div className='album-last' key={currentTrack.id}>
          <div className='album-l'>
            <div className='album-l-1'>
            <img className='album-cover' src={trackDetail.album.cover_big} alt="Album Cover" />
            <p className='album-ttlM album-ttl2'>Tittle: {trackDetail.album.title}</p>
            </div>
          <div>
          <Link to={`/album/${trackDetail.album.id}`}>
            <button className="button type1">
              <span className="btn-txt">More</span>
            </button>
          </Link>
           </div>
          </div>
        </div>
      )}
        </div>
       </div>
       </div>
    </div>
  );
};

export default TrackDetail;
