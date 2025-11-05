import { Route, Routes } from 'react-router-dom';

// New SportsPedia Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import UnifiedSearchPage from './pages/UnifiedSearchPage';
import PersonDetailPage from './pages/PersonDetailPage';
import PerformancePage from './pages/PerformancePage';
import AchievementDetailPage from './pages/AchievementDetailPage';
import RecordDetailPage from './pages/RecordDetailPage';
import AthletesPage from './pages/AthletesPage';
import CoachesPage from './pages/CoachesPage';
import TeamsPage from './pages/TeamsPage';
import CompetitionsPage from './pages/CompetitionsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import ExplorePage from './pages/innerPages/ExplorePage';

// Auth Pages (Keep existing)
import LoginPage from './pages/authPages/LoginPage';
import SignupPage from './pages/authPages/SignupPage';
import ProfilePage from './pages/authPages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Utility Pages
import NotFoundPage from './pages/innerPages/NotFoundPage';

const Routers = () => {
    return (
        <>
            <Routes>
                {/* New Clean Pages */}
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/search' element={<UnifiedSearchPage />}></Route>
                <Route path='/person/:type/:id' element={<PersonDetailPage />}></Route>
                <Route path='/athletes' element={<UnifiedSearchPage />}></Route>
                <Route path='/coaches' element={<UnifiedSearchPage />}></Route>
                <Route path='/referees' element={<UnifiedSearchPage />}></Route>
                <Route path='/performance' element={<PerformancePage />}></Route>
                <Route path='/performance/achievement/:id' element={<AchievementDetailPage />}></Route>
                <Route path='/performance/record/:id' element={<RecordDetailPage />}></Route>
                
                {/* TCO Routes */}
                <Route path='/teams' element={<TeamsPage />}></Route>
                <Route path='/teams/:id' element={<TeamDetailPage />}></Route>
                <Route path='/competitions' element={<CompetitionsPage />}></Route>
                <Route path='/competitions/:id' element={<CompetitionDetailPage />}></Route>
                <Route path='/organizations' element={<OrganizationsPage />}></Route>
                <Route path='/organizations/:id' element={<OrganizationDetailPage />}></Route>
                
                <Route path='/explore' element={<ExplorePage />}></Route>

                {/* Auth Pages - KEEP THESE */}
                <Route path='/login' element={<LoginPage />}></Route>
                <Route path='/signup' element={<SignupPage />}></Route>
                <Route path='/profile' element={<ProfilePage />}></Route>
                <Route path='/admin' element={<AdminPage />}></Route>

                <Route path='*' element={<NotFoundPage />}></Route>
            </Routes>
        </>
    );
};

export default Routers;