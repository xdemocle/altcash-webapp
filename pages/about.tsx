import type { NextPage } from 'next';
import AboutTemplate from '../components/templates/about';

const About: NextPage = () => {
  return <AboutTemplate />;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default About;
