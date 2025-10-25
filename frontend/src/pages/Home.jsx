import React from 'react'
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import OurServices from '../components/OurServices';
import RelatedDoctors from '../components/RelatedDoctors';

const Home = () => {
  return (
    <>
      <Header />

      <SpecialityMenu />
      <TopDoctors />
      <OurServices />

  <Banner />
    </>
  )
}

export default Home;