import { theme } from '@/common/theme';
import {
  ContactSupportOutlined,
  HomeOutlined, // LockOutlined,
  MonetizationOnOutlined,
  PeopleAltOutlined
} from '@mui/icons-material';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import useAuth from '../../hooks/use-auth';

const StyledList = styled(List)({
  position: 'relative',
  height: 'calc(100% - 6rem)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0
});

const StyledListItemIcon = styled(ListItemIcon)({
  marginLeft: '1.3rem',
  marginRight: '0.4rem',
  color: '#666',
  '.active &': {
    color: '#fff'
  }
});

const StyledListItemText = styled(ListItemText)({
  paddingLeft: '0rem',
  marginLeft: '0rem'
});

const StyledListItemButton = ({
  children,
  href,
  label,
  selected,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  label: string;
  selected?: boolean;
}) => {
  return (
    <ListItemButton
      {...rest}
      component={Link}
      href={href}
      sx={{
        flexGrow: '0 !important',
        position: 'relative',
        paddingLeft: '1rem',
        paddingRight: '1.8rem',
        margin: '0',
        height: '4.75rem',
        width: '100%',
        textDecoration: 'none !important',
        color: 'inherit',
        '&:visited': {
          color: 'inherit'
        },
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '1.55rem',
          width: '3rem',
          height: '3rem',
          borderRadius: '.35rem',
          backgroundColor: theme.palette.secondary.main,
          transform: 'translateY(-50%) rotate(-8deg)',
          opacity: 0.05,
          zIndex: -1
        },
        '&:hover::after': {
          opacity: 0.1
        },
        ...(selected && {
          '&.active::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '1.5rem',
            width: '3.2rem',
            height: '3.2rem',
            borderRadius: '.6rem',
            backgroundColor: theme.palette.primary.main,
            zIndex: -1
          }
        })
      }}
    >
      <StyledListItemIcon>{children}</StyledListItemIcon>
      <StyledListItemText primary={label} />
    </ListItemButton>
  );
};

type Props = {
  isSidebarOpen: boolean;
};

const MainLinks = ({ isSidebarOpen }: Props) => {
  // const auth = useAuth();
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <StyledList as="nav">
        <Tooltip
          title="Homepage"
          placement="right"
          enterDelay={isSidebarOpen ? 2000 : 50}
        >
          <StyledListItemButton href="/" label="Home">
            <HomeOutlined />
          </StyledListItemButton>
        </Tooltip>

        <Tooltip
          title="Buy crypto coins"
          placement="right"
          enterDelay={isSidebarOpen ? 2000 : 50}
        >
          <StyledListItemButton
            href="/buy"
            label="Buy"
            selected={
              router.pathname == '/buy' ||
              router.pathname == '/buy/[tab]' ||
              router.pathname == '/coin/[id]'
            }
          >
            <MonetizationOnOutlined />
          </StyledListItemButton>
        </Tooltip>

        <Tooltip
          title="About Us"
          placement="right"
          enterDelay={isSidebarOpen ? 2000 : 50}
        >
          <StyledListItemButton
            href="/about"
            label="About Us"
            selected={router.pathname == '/about'}
          >
            <PeopleAltOutlined />
          </StyledListItemButton>
        </Tooltip>

        <Tooltip
          title="Support"
          placement="right"
          enterDelay={isSidebarOpen ? 2000 : 50}
        >
          <StyledListItemButton
            href="/support"
            label="Support"
            selected={router.pathname == '/support'}
          >
            <ContactSupportOutlined />
          </StyledListItemButton>
        </Tooltip>
      </StyledList>
    </ThemeProvider>
  );
};

export default MainLinks;
