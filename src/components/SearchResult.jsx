import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Search from './Search';
import './SearchResult.css'


const SearchResult = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);

  useEffect(() => {
    const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
    setLikedTracks(storedLikedTracks);
  }, []);

  useEffect(() => {
    setLoading(true);

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    if (!searchQuery || !searchQuery.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get('https://deezerdevs-deezer.p.rapidapi.com/search', {
          headers: {
            'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          },
          params: {
            q: searchQuery.trim(),
            type: 'artist,track,album,playlist'
          }
        });

        const allResults = response.data.data || [];
        setSearchResults(allResults);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleResultClick = (resultId, e) => {
    setSelectedResult(resultId);
    const selectedResultData = searchResults.find((result) => result.id === resultId);
    if (selectedResultData) {
      setSelectedData(selectedResultData);
    }
    const resultContainer = e.currentTarget.closest('.resultContainer');
    if (resultContainer) {
      resultContainer.style.display = 'none';
    }
  };

  const handleLikeButtonClick = (resultId) => {
    const selectedResultData = searchResults.find((result) => result.id === resultId);
    if (selectedResultData) {
      const isLiked = likedTracks.some((track) => track.id === resultId);
      if (isLiked) {
        const newLikedTracks = likedTracks.filter((track) => track.id !== resultId);
        setLikedTracks(newLikedTracks);
        localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks)); 
      } else {
        setLikedTracks([...likedTracks, selectedResultData]);
        localStorage.setItem('likedTracks', JSON.stringify([...likedTracks, selectedResultData])); 
      }
    }
  };
  

  return (
    <div className='like-main'>
      <div>
      <Search/>
      </div>
      <div className="search-results like-list-container">
       <div className="like-list">
        <h2 className="likeHeader">Search Results</h2>
        {searchResults.length === 0 && <p className='no-track'>No results.</p>}
        {searchResults.map((result) => (
        <div key={result.id} className="resultBox search-result-item">
          {result.type === 'track' && (
          <Link to={`/track/${result.id}`} className='s-Li' onClick={(e) => e.stopPropagation()}>
            <div key={result.id} className="resultButtonBox" onClick={(e) => handleResultClick(result.id, e)}>
              <img src={result.album.cover_small} alt="Track Cover" />
              <div className='TrackDetails'>
                <p className='trackName'>{result.title}</p>
                <p className="artistName">{result.artist.name}</p>
              </div>
            </div>
          </Link>
        )}
          <label className="like-container2">
            <input
            type="checkbox"
            checked={likedTracks.some((likedTrack) => likedTrack.id === result.id)}
            readOnly
            onClick={(e) => {
              e.stopPropagation();
              handleLikeButtonClick(result.id);
            }}
            />
            <div className="checkmark2">
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

export default SearchResult;
