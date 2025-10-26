import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AthletesPage from './pages/AthletesPage';
import TeamsPage from './pages/TeamsPage';
import CompetitionsPage from './pages/CompetitionsPage';
import VenuesPage from './pages/VenuesPage';
import SportsPage from './pages/SportsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'athletes',
        element: <AthletesPage />,
      },
      {
        path: 'teams',
        element: <TeamsPage />,
      },
      {
        path: 'competitions',
        element: <CompetitionsPage />,
      },
      {
        path: 'venues',
        element: <VenuesPage />,
      },
      {
        path: 'sports',
        element: <SportsPage />,
      },
    ],
  },
]);

export default router;