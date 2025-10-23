import type { NextPage } from 'next';
import SupportTemplate from '../components/templates/support';

const Support: NextPage = () => {
  return <SupportTemplate />;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Support;
