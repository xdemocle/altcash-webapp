import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';
import useGlobal from '~/hooks/use-global';
import MainLinks from '../../molecules/main-links';
import { ButtonLogoStyled, DrawerStyled, ToolbarHeaderStyled, ToolbarStyled, ToolbarTitleStyled } from './styled';

const Sidebar = () => {
  const { breakpoints } = useTheme();
  const isDownMd = useMediaQuery(breakpoints.down('md'));
  const { isSidebarOpen, setSidebarOpen } = useGlobal();

  useEffect(() => {
    if (isDownMd) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isDownMd, setSidebarOpen]);

  const handleDrawerToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <DrawerStyled
      sx={{ display: { xs: 'none', sm: 'block' } }}
      variant="permanent"
      anchor="left"
      className={clsx('DrawerStyled', !isSidebarOpen ? 'DrawerStyled--Close' : '')}
      classes={{
        paper: clsx('DrawerStyled-Paper', !isSidebarOpen ? 'DrawerStyled-Paper--Close' : ''),
      }}
      ModalProps={{
        // Better open performance on mobile.
        keepMounted: true,
      }}
      open={isSidebarOpen}
    >
      <ToolbarStyled className={isSidebarOpen ? 'DrawerStyled-Toolbar--Open' : ''}>
        <Tooltip title={`${isSidebarOpen ? 'Collapse' : 'Expand'} sidebar`} placement="right">
          <ToolbarHeaderStyled>
            <ButtonLogoStyled disableRipple onClick={handleDrawerToggle} aria-label="toggle drawer">
              <Image src={'/assets/logo.png'} alt="logo.png" width="48" height="48" />
            </ButtonLogoStyled>
            <ToolbarTitleStyled variant="subtitle1">Altcash</ToolbarTitleStyled>
          </ToolbarHeaderStyled>
        </Tooltip>

        <MainLinks isSidebarOpen={isSidebarOpen} />
      </ToolbarStyled>
    </DrawerStyled>
  );
};

export default Sidebar;
