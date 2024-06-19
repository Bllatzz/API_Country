import React from 'react';

import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
function Footer(){

    return(
        <>
        <footer>
            <div className=''>
                <h2>API Países </h2>
                <p>Make By: Bllatz</p>
            </div>
            <div className='social'>
                <a href="https://www.instagram.com/bllatz" target='__blank'><FontAwesomeIcon icon={faInstagram} size='2x'/></a>
                <a href="https://potfolio-joao-pedro-dias-rocha.netlify.app/" target='__blank'>Portfolio</a>
                
            </div>
        </footer>
        </>
    )
}
export default Footer