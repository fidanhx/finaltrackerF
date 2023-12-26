import React from 'react';
import Search from './Search';
import photo3 from './photo3.png'
import './VideoPlayer.css'


const VideoPlayer = () => {
  return (
    <div className='photo-main'>
      <div>
      <Search/>
      </div>
      <div className="fotoContainer">
        <img className='photo3' src={photo3} alt='gif'/>
        <div className='photo-ps'>
          <div>
            <p className='photo-pt'>Track World</p>
          </div>
          <div>
            <p className='photo-p'>Your Sound, Your Journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
