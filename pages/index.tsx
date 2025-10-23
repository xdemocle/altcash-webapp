import type { NextPage } from 'next';
import Homepage from '../components/templates/homepage';

const Index: NextPage = () => {
  return <Homepage />;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Index;
