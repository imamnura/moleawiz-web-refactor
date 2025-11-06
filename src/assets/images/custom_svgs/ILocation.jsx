import React from 'react';

const ILocation = ({ fill, width, height }) => {
  return (
    <>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 9 12">
            <path id="Path_1823414" data-name="Path 1823414" d="M12.5,0A4.506,4.506,0,0,0,8,4.5c0,3.231,4.193,7.277,4.371,7.447a.186.186,0,0,0,.259,0C12.808,11.777,17,7.731,17,4.5A4.506,4.506,0,0,0,12.5,0Zm0,6.562A2.062,2.062,0,1,1,14.563,4.5,2.063,2.063,0,0,1,12.5,6.562Z" transform="translate(-8)" fill={fill} />
        </svg>
    </>
  )
};

export default ILocation;
