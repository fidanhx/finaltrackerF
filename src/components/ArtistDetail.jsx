import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Search from './Search';
import './ArtistDetail.css'

const ArtistDetail = () => {
  const { id } = useParams();
  const [artistDetail, setArtistDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistDetail = async () => {
      const options = {
        method: 'GET',
        url: `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`,
        headers: {
          'X-RapidAPI-Key': '4e7051cc64msh653c22397ad1411p118884jsnbac5082875fe',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        setArtistDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchArtistDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!artistDetail) {
    return <div>No artist data available.</div>;
  }

  return (
    <div>
      <Search/>
      <div className='all-artDtl'>
        <div className='artist-box'>
          <img className='artist-img' src={artistDetail.picture_big} alt="Artist" />
        </div>
        <div className='one-aristDtl'>
          <p className='artist-nm2'>{artistDetail.name}</p>
          <div className='artist-info'>
            <p className='trackAlbum trackName'>Number of Albums: {artistDetail.nb_album}</p>
            <p className="artistFan trackName">Number of Fans: {artistDetail.nb_fan}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
