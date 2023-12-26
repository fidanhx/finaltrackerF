import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Search.css';
import SearchResult from './SearchResult';
import likebtn from './likebtn.png'
import searchIcon from './searchIcon.svg'
import plus from './Plus.svg'


const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [likedTracks, setLikedTracks] = useState([]);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignupBox, setShowSignupBox] = useState(false);
  const [showCreateListForItem, setShowCreateListForItem] = useState({});
  const [showCreateList, setShowCreateList] = useState(false);
  const [createdLists, setCreatedLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [playlists, setPlaylists] = useState({});


  const resultRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem('playlists')) || {};
    console.log('Stored Playlists:', storedPlaylists); 
    setPlaylists(storedPlaylists);
  }, []);
  
  
  
  
  const handleOutsideClick = (e) => {
    if (
      resultRef.current &&
      !resultRef.current.contains(e.target) &&
      inputRef.current &&
      !inputRef.current.contains(e.target)
    ) {
      setSearchResults([]); 
    }
  };

  const handleInputClick = () => {
    if (!searchResults.length) {
      fetchSearchResults(searchQuery); 
    }
    const resultContainer = document.querySelector('.resultContainer');
    if (resultContainer) {
      resultContainer.style.display = 'block';
    }
  };

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
  

  const handleRemoveButtonClick = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    if (!inputValue.trim()) {
      setSearchResults([]);
    } else {
      fetchSearchResults(inputValue);
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

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get('https://deezerdevs-deezer.p.rapidapi.com/search', {
        headers: {
          'X-RapidAPI-Key': 'be707a6767msh3a38c4f6167ca12p13f54ajsn010b6fdd2b34',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
        params: {
          q: query.trim(),
          type: 'artist,track,album,playlist',
        },
      });
      if (response.data && response.data.data) {
        const firstFiveResults = response.data.data.slice(0, 8) || [];
        setSearchResults(firstFiveResults);
        }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      window.location.href = `/search-result?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const storedLikedTracks = JSON.parse(localStorage.getItem('likedTracks')) || [];
    setLikedTracks(storedLikedTracks);
  }, []);


  const toggleSignupBox = () => {
    setShowSignupBox(!showSignupBox);
    setShowLoginBox(false);
  };
  
  const toggleLoginBox = () => {
    setShowLoginBox(!showLoginBox);
    setShowSignupBox(false); 
  };

  const openSignupBox = (e) => {
    e.preventDefault(); 
    setShowSignupBox(true);
    setShowLoginBox(false); 
  };


  const closeSignupBox = () => {
    setShowSignupBox(false);
  };

  const closeLoginBox = () => {
    setShowLoginBox(false);
  };

  const [visiblePopups, setVisiblePopups] = useState({});

  const handleAddToPlaylist = (resultId) => {
    // Diğer işlemler...
    setShowCreateListForItem(searchResults.find(result => result.id === resultId));
    setVisiblePopups((prevPopups) => ({
      ...prevPopups,
      [resultId]: !prevPopups[resultId],
    }));
  };
  
  
  const handleCreateList = () => {
    if (newListName.trim() !== '') {
      const newPlaylist = {
        name: newListName,
        tracks: [showCreateListForItem], 
      };
  
      const updatedPlaylists = { ...playlists, [newListName]: newPlaylist };
      setPlaylists(updatedPlaylists);
  
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  
      setNewListName('');
      setShowCreateList(false);
    }
  };
  
  const handleAddTrackToPlaylist = (playlistName) => {
    const selectedResultData = searchResults.find((result) => result.id === showCreateListForItem.id);
    
    if (selectedResultData) {
      const updatedPlaylist = {
        ...playlists[playlistName],
        tracks: [...playlists[playlistName].tracks, selectedResultData],
      };
  
      const updatedPlaylists = {
        ...playlists,
        [playlistName]: updatedPlaylist,
      };
  
      setPlaylists(updatedPlaylists);
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    } else {
      console.log("selectedResultData is undefined or null");
    }
  };
  

  return (
    <div>
        <h2 className='h2-s'><Link className='h2-s-link' to="/">Track World</Link></h2>
    <div className='container'>
    <div className='input-wrapper-s'>
      <div className='input-with-button'>
        <div className='input-s-div'>
          <input
          className='input-s'
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress} 
          placeholder="Search for a track..."
          ref={inputRef}
          onClick={handleInputClick}
          />
        </div>
        <button className="button-cross" onClick={handleRemoveButtonClick}>
          <span className="X"></span>
          <span className="Y"></span>
        </button>
        <button type="button" className="input__button__shadow input__button__shadow--variant" onClick={handleSearch}>
          <img className='searchIcon' src={searchIcon} alt='icon'/>
        </button>
      </div>
      
      <div className="button-container">
        <Link style={{ textDecoration: 'none' }} to="/liked-tracks">
          <button className="btn">
            <img className='like-btn' src={likebtn} alt='like'/>
          </button>
        </Link>
      </div>

      <Link to="/playlist">
  <button className="uiverse">
    <div className="wrapper">
        <span>PLAYLIST</span>
        <div className="circle circle-12"></div>
        <div className="circle circle-11"></div>
        <div className="circle circle-10"></div>
        <div className="circle circle-9"></div>
        <div className="circle circle-8"></div>
        <div className="circle circle-7"></div>
        <div className="circle circle-6"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-1"></div>
    </div>
</button>
</Link>

      <button className="animated-button" onClick={toggleSignupBox}>
        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z">
          </path>
        </svg>
        <span className="text-sign-up">Sign up</span>
        <span className="circle"></span>
        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
          <path
          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z">
          </path>
        </svg>
      </button>

      {showSignupBox && (
      <div className="login-box">
        <button className="close-button" onClick={toggleSignupBox}>
          x
        </button>
        <p className='login-text'>Sign up</p>
        <form>
          <div className="user-box">
            <input required="" name="" type="text"/>
            <label>Name</label>
          </div>
          <div className="user-box">
            <input required="" name="" type="text"/>
            <label>Username</label>
          </div>
          <div className="user-box">
            <input required="" name="" type="text"/>
            <label>Email</label>
          </div>
          <div className="user-box">
            <input required="" name="" type="password"/>
            <label>Password</label>
          </div>
          <a href="#" onClick={closeSignupBox}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Register
          </a>
        </form>
      </div>
    )}
    
     <button className='log-in-btn' onClick={toggleLoginBox}>Log in</button>
     {showLoginBox && (
     <div className="login-box">
      <button className="close-button" onClick={toggleLoginBox}>
        x
      </button>
      <p className='login-text'>Login</p>
      <form>
        <div className="user-box">
          <input required="" name="" type="text"/>
          <label>Email</label>
        </div>
        <div className="user-box">
          <input required="" name="" type="password"/>
          <label>Password</label>
       </div>
       <a href="#" onClick={closeLoginBox}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Submit
       </a>
      </form>
      <p>Don't have an account? <a href="" className="a2" onClick={openSignupBox}>Sign up!</a></p>
     </div>
   )}
  </div>
  <ul className='resultList'>
    {searchResults.length > 0 && searchQuery.trim() !== '' && (
    <div className="resultContainer" ref={resultRef}>
      {searchResults.map((result) => (
      <li key={result.id}>
        <div className="resultBox">
          {result.type === 'track' && (
          <Link
          to={`/track/${result.id}`}
          onClick={(e) => e.stopPropagation()}
          className='s-Li'
          >
            <div key={result.id} className="resultButtonBox" onClick={(e) => handleResultClick(result.id, e)}>
              <img src={result.album.cover_small} alt="Track Cover" />
              <div className='TrackDetails'>
                <p className='trackName'>{result.title}</p>
                <p className="artistName">{result.artist.name}</p>
              </div>
            </div>
          </Link>
        )}
        <label className="like-container">
          <input type="checkbox" checked={likedTracks.some((track) => track.id === result.id)} onChange={() => handleLikeButtonClick(result.id)} />
          <div className="checkmark">
            <svg viewBox="0 0 256 256">
              <rect fill="none" height="256" width="256"></rect>
              <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path>
            </svg>
          </div>
        </label>
        <button className='plus' onClick={(e) => handleAddToPlaylist(result.id, e)}>
          <img src={plus} alt='add'/>
        </button>
        <div className="createListPopup" style={{ display: visiblePopups[result.id] ? 'block' : 'none' }}>
                <input
                  type="text"
                  placeholder="Enter playlist name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <button onClick={handleCreateList}>Create</button>
                <ul>
                  {Object.keys(playlists).map((playlistName) => (
                    <li key={playlistName}>
                      <button onClick={() => handleAddTrackToPlaylist(playlistName)}>
                        {playlistName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
        </div>
      </li>
    ))}
    </div>
  )}
  </ul>
  {showSearchResult && (
  <SearchResult searchResults={selectedData} />
)} 
  </div>
  </div>
  );
};

export default Search;


