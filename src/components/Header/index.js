import React from 'react'
// Images
import RMDBLogo from '../../images/react-movie-logo.svg'
import TMDBLogo from '../../images/tmdb_logo.svg'
// Styles
import { Wrapper, Content, LogoImg, TMDBLogoImg } from './Header.styles'
// Routing
import { Link } from 'react-router-dom'

const Header = () => (
  <Wrapper>
    <Content>
      <Link to="/">
        <LogoImg src={RMDBLogo} alt="rmdb-logo" />
        {/* {console.log('Should go to home with 1 page only')} */}
      </Link>
      <TMDBLogoImg src={TMDBLogo} alt="tmdb-logo" />
    </Content>
  </Wrapper>
)

export default Header
