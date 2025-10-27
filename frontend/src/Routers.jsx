import { Route, Routes } from 'react-router-dom';

import Home1 from './pages/homePages/Home1';
import Home2 from './pages/homePages/Home2';
import Home3 from './pages/homePages/Home3';
import Home4 from './pages/homePages/Home4';
import Home5 from './pages/homePages/Home5';

import AboutUsPage from './pages/innerPages/AboutUsPage';
import AboutUs2Page from './pages/innerPages/AboutUs2Page';
import TeamPage from './pages/innerPages/TeamPage';
import Team2Page from './pages/innerPages/Team2Page';
import TeamDetailsPage from './pages/innerPages/TeamDetailsPage';
import PricingPage from './pages/innerPages/PricingPage';
import FaqPage from './pages/innerPages/FaqPage';
import ContactUsPage from './pages/innerPages/ContactUsPage';

import ProjectPage from './pages/projectPages/ProjectPage';
import Project2Page from './pages/projectPages/Project2Page';
import Project3Page from './pages/projectPages/Project3Page';
import ProjectDetailsPage from './pages/projectPages/ProjectDetailsPage';

import ServicesPage from './pages/servicePages/ServicesPage';
import Services2Page from './pages/servicePages/Services2Page';
import Services3Page from './pages/servicePages/Services3Page';
import ServicesDetailsPage from './pages/servicePages/ServicesDetailsPage';

import BlogStandardPage from './pages/blogPages/BlogStandardPage';
import BlogWithSidebarPage from './pages/blogPages/BlogWithSidebarPage';
import Blog2ColumnPage from './pages/blogPages/Blog2ColumnPage';
import Blog3ColumnPage from './pages/blogPages/Blog3ColumnPage';
import BlogSinglePage from './pages/blogPages/BlogSinglePage';
import BlogSingleWithSidebarPage from './pages/blogPages/BlogSingleWithSidebarPage';
import NotFoundPage from './pages/innerPages/NotFoundPage';

const Routers = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home1 />}></Route>
                <Route path='/home-2' element={<Home2 />}></Route>
                <Route path='/home-3' element={<Home3 />}></Route>
                <Route path='/home-4' element={<Home4 />}></Route>
                <Route path='/home-5' element={<Home5 />}></Route>

                <Route path='/about-us' element={<AboutUsPage />}></Route>
                <Route path='/about-us-2' element={<AboutUs2Page />}></Route>
                <Route path='/team' element={<TeamPage />}></Route>
                <Route path='/team-2' element={<Team2Page />}></Route>
                <Route path='/team-details/:id' element={<TeamDetailsPage />}></Route>
                <Route path='/pricing' element={<PricingPage />}></Route>
                <Route path='/faq' element={<FaqPage />}></Route>
                <Route path='/contact-us' element={<ContactUsPage />}></Route>

                <Route path='/project' element={<ProjectPage />}></Route>
                <Route path='/project-2' element={<Project2Page />}></Route>
                <Route path='/project-3' element={<Project3Page />}></Route>
                <Route path='/project-details/:id' element={<ProjectDetailsPage />}></Route>

                <Route path='/services' element={< ServicesPage />}></Route>
                <Route path='/services-2' element={<Services2Page />}></Route>
                <Route path='/services-3' element={<Services3Page />}></Route>

                <Route path='/services-details/:id' element={<ServicesDetailsPage />}></Route>
                <Route path='/blog-standard' element={<BlogStandardPage />}></Route>
                <Route path='/blog-standard?:page?' element={<BlogStandardPage />}></Route>
                <Route path='/blog-with-sidebar' element={<BlogWithSidebarPage />}></Route>
                <Route path='/blog-with-sidebar?:page?' element={<BlogWithSidebarPage />}></Route>
                <Route path='/blog-2-column' element={<Blog2ColumnPage />}></Route>
                <Route path='/blog-2-column?:page?' element={<Blog2ColumnPage />}></Route>
                <Route path='/blog-3-column' element={<Blog3ColumnPage />}></Route>
                <Route path='/blog-3-column?:page?' element={<Blog3ColumnPage />}></Route>
                <Route path='/blog-single/:id' element={<BlogSinglePage />}></Route>
                <Route path='/blog-single-with-sidebar/:id' element={<BlogSingleWithSidebarPage />}></Route>

                <Route path='*' element={<NotFoundPage />}></Route>
            </Routes>
        </>
    );
};

export default Routers;