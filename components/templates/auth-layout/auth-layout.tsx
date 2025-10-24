import { ReactNode } from 'react';
import Bottombar from '../../organisms/bottom-bar';
import { AppFrame, Content, Inner } from './components';

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <AppFrame>
      <Inner>
        <Content>{children}</Content>
      </Inner>
      <Bottombar />
    </AppFrame>
  );
};

export default AuthLayout;
