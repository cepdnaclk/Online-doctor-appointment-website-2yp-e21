import React, { Suspense, lazy } from 'react';

const Header = lazy(() => import('../components/Header'));
const SpecialityMenu = lazy(() => import('../components/SpecialityMenu'));
const TopDoctors = lazy(() => import('../components/TopDoctors'));
const OurServices = lazy(() => import('../components/OurServices'));
const Banner = lazy(() => import('../components/Banner'));

const Home = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <SpecialityMenu />
        <TopDoctors />
        <OurServices />
        <Banner />
      </Suspense>
    </>
  );
};

export default Home;