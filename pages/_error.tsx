import type { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode ? `An error ${statusCode} occurred` : 'An error occurred on client'}</h1>
      <p>Sorry, something went wrong.</p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
