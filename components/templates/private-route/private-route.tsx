'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import useAuth from '~/hooks/use-auth';

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const router = useRouter();
  const auth = useAuth();
  // const location = useLocation();

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    // return <Navigate to="/login" state={{ from: location }} replace />;
    router.push('/login');
    return null;
  }

  return children;
};

export default PrivateRoute;
