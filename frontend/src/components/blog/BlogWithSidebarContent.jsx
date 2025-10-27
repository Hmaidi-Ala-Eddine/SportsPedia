import SingleBlogStandard from '@/components/blog/SingleBlogStandard';
import ArchiveWidget from '@/components/widgets/ArchiveWidget';
import CategoryWidget from '@/components/widgets/CategoryWidget';
import FollowWidget from '@/components/widgets/FollowWidget';
import GalleryWidget from '@/components/widgets/GalleryWidget';
import RecentPostsWidget from '@/components/widgets/RecentPostsWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TagsWidget from '@/components/widgets/TagsWidget';
import BlogData from '@/assets/jsonData/blog/BlogData.json';
import Pagination from 'react-paginate';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const BlogWithSidebarContent = () => {

    // Pagination 
    const navigate = useNavigate();
    const { page } = useParams();

    const currentPageNumber = Number(page) || 1;
    const [currentPage, setCurrentPage] = useState(currentPageNumber);
    const [itemsPerPage] = useState(3);

    useEffect(() => {
        setCurrentPage(currentPageNumber);
    }, [currentPageNumber]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBlogData = BlogData.slice(startIndex, endIndex);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
        navigate(`/blog-with-sidebar?page=${selectedPage}`);

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
    };

    const totalPages = Math.ceil(BlogData.length / itemsPerPage);

    return (
        <>
            <div className="blog-area full-blog default-padding-bottom">
                <div className="container">
                    <div className="blog-items">
                        <div className="row">
                            <div className="blog-content col-xl-8 col-lg-7 col-md-12 pr-35 pr-md-15 pl-md-15 pr-xs-15 pl-xs-15">
                                <div className="blog-item-box">
                                    {currentBlogData.map(blog =>
                                        <SingleBlogStandard blog={blog} key={blog.id} />
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-12 pagi-area text-center">
                                        <Pagination
                                            previousLabel={currentPage === 1 ? <i className='fas fa-ban'></i> : <i className='fas fa-angle-double-left'></i>}
                                            nextLabel={currentPage === totalPages ? <i className='fas fa-ban'></i> : <i className='fas fa-angle-double-right'></i>}
                                            breakLabel={'...'}
                                            pageCount={Math.ceil(BlogData.length / itemsPerPage)}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination text-center'}
                                            activeClassName={'active'}
                                            pageClassName={'page-item'}
                                            pageLinkClassName={'page-link'}
                                            previousLinkClassName={'page-link'}
                                            nextLinkClassName={'page-link'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar col-xl-4 col-lg-5 col-md-12 mt-md-50 mt-xs-50">
                                <aside>
                                    <SearchWidget />
                                    <RecentPostsWidget />
                                    <CategoryWidget />
                                    <GalleryWidget />
                                    <ArchiveWidget />
                                    <FollowWidget />
                                    <TagsWidget />
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogWithSidebarContent;