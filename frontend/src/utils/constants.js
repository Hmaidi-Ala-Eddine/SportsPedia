export const APP_NAME = 'SportsPedia';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  ATHLETES: '/persons/athletes',
  COACHES: '/persons/coaches',
  TEAMS: '/teams',
  COMPETITIONS: '/competitions',
  VENUES: '/venues',
  SPORTS: '/sports',
  SEARCH: '/search',
};

// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', path: '/', icon: 'HomeIcon' },
  { name: 'Athletes', path: '/athletes', icon: 'UserGroupIcon' },
  { name: 'Teams', path: '/teams', icon: 'UsersIcon' },
  { name: 'Competitions', path: '/competitions', icon: 'TrophyIcon' },
  { name: 'Venues', path: '/venues', icon: 'MapPinIcon' },
  { name: 'Sports', path: '/sports', icon: 'FireIcon' },
];

// Sport Categories
export const SPORT_CATEGORIES = [
  'Team Sport',
  'Individual Sport',
  'Combat Sport',
  'Water Sport',
  'Winter Sport',
  'Motor Sport',
];