import React from 'react';
import { ColorPrimary, textDropdownHeader } from '../../../config/constant/color/index'

const IChangePassword = ({ mouseOv }) => {
  return (
    <>
      {
        mouseOv === 'change-password' ?
        <span style={{marginRight:"14px",fontSize:"18px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20.455" viewBox="0 0 18 20.455">
                  <path id="lock" d="M177.182,121h-1.739v-5.727A3.272,3.272,0,0,0,172.17,112H165.83a3.272,3.272,0,0,0-3.273,3.273V121h-1.739a.817.817,0,0,0-.818.818v9.818a.817.817,0,0,0,.818.818h16.364a.817.817,0,0,0,.818-.818v-9.818A.817.817,0,0,0,177.182,121Zm-7.466,6.06v1.355a.205.205,0,0,1-.2.2h-1.023a.205.205,0,0,1-.2-.2V127.06a1.228,1.228,0,1,1,1.432,0ZM173.6,121h-9.2v-5.727a1.433,1.433,0,0,1,1.432-1.432h6.341a1.433,1.433,0,0,1,1.432,1.432Z" transform="translate(-160 -112)" fill={ColorPrimary} />
              </svg>
        </span>
          :
          <span style={{marginRight:"14px",fontSize:"18px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20.455" viewBox="0 0 18 20.455">
                    <path id="lock" d="M177.182,121h-1.739v-5.727A3.272,3.272,0,0,0,172.17,112H165.83a3.272,3.272,0,0,0-3.273,3.273V121h-1.739a.817.817,0,0,0-.818.818v9.818a.817.817,0,0,0,.818.818h16.364a.817.817,0,0,0,.818-.818v-9.818A.817.817,0,0,0,177.182,121Zm-7.466,6.06v1.355a.205.205,0,0,1-.2.2h-1.023a.205.205,0,0,1-.2-.2V127.06a1.228,1.228,0,1,1,1.432,0ZM173.6,121h-9.2v-5.727a1.433,1.433,0,0,1,1.432-1.432h6.341a1.433,1.433,0,0,1,1.432,1.432Z" transform="translate(-160 -112)" fill={textDropdownHeader}/>
                </svg>
          </span>
      }
    </>
  )
};

export default IChangePassword;
