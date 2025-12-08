export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  active: boolean;
  collapsible: boolean;
  sublist?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: 'ion:home-sharp',
    active: true,
    collapsible: false,
    sublist: [
      {
        title: 'Dashboard',
        path: '/',
        active: false,
        collapsible: false,
      },
      {
        title: 'Sales',
        path: '/',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'Portfolio',
    path: '/portfolio',
    icon: 'ic:baseline-view-module',
    active: false,
    collapsible: false,
  },
  {
    title: 'Hero Banner',
    path: '/hero-banner',
    icon: 'ic:baseline-image',
    active: false,
    collapsible: false,
  },
  {
    title: 'Authentication',
    path: 'authentication',
    icon: 'f7:exclamationmark-shield-fill',
    active: true,
    collapsible: true,
    sublist: [
      {
        title: 'Sign In',
        path: 'login',
        active: true,
        collapsible: false,
      },
      {
        title: 'Sign Up',
        path: 'sign-up',
        active: true,
        collapsible: false,
      },
      {
        title: 'Forgot password',
        path: 'forgot-password',
        active: true,
        collapsible: false,
      },
      {
        title: 'Reset password',
        path: 'reset-password',
        active: true,
        collapsible: false,
      },
    ],
  },
];

export default navItems;
