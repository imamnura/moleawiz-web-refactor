import React from 'react';
import { ColorPrimary, textDropdownHeader } from '../../../config/constant/color/index'

const ILogout = ({ mouseOv }) => {
  return (
    <>
      {
        mouseOv === 'logout' ?
          <span style={{marginRight:"14px",fontSize:"18px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path id="logout_FILL0_wght400_GRAD0_opsz24" d="M122-822a1.926,1.926,0,0,1-1.412-.588A1.926,1.926,0,0,1,120-824v-14a1.926,1.926,0,0,1,.588-1.412A1.926,1.926,0,0,1,122-840h7v2h-7v14h7v2Zm11-4-1.375-1.45,2.55-2.55H126v-2h8.175l-2.55-2.55L133-836l5,5Z" transform="translate(-120 840)" fill={ColorPrimary}/>
              </svg>
          </span>
          :
          <span style={{marginRight:"14px",fontSize:"18px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                  <path id="logout_FILL0_wght400_GRAD0_opsz24" d="M122-822a1.926,1.926,0,0,1-1.412-.588A1.926,1.926,0,0,1,120-824v-14a1.926,1.926,0,0,1,.588-1.412A1.926,1.926,0,0,1,122-840h7v2h-7v14h7v2Zm11-4-1.375-1.45,2.55-2.55H126v-2h8.175l-2.55-2.55L133-836l5,5Z" transform="translate(-120 840)" fill={textDropdownHeader}/>
              </svg>
          </span>
      }
    </>
  )
};

export default ILogout;
