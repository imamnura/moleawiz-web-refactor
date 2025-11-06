import React from 'react';

const IClock = ({ fill, width, height }) => {
  return (
    <>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 12">
            <path id="clock" d="M6,0a6,6,0,1,0,6,6A6.007,6.007,0,0,0,6,0ZM8.854,9.1a.5.5,0,0,1-.707,0l-2.5-2.5A.5.5,0,0,1,5.5,6.25V3a.5.5,0,1,1,1,0V6.043L8.854,8.4a.5.5,0,0,1,0,.707Zm0,0" fill={fill} />
        </svg>
    </>
  )
};

export default IClock;
