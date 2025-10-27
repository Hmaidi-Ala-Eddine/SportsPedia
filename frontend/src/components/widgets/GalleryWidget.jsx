import GalleryData from '@/assets/jsonData/widgets/GalleryWidgetData.json'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Link } from 'react-router-dom';

const GalleryWidget = () => {
    return (
        <>
            <div className="sidebar-item gallery">
                <h4 className="title">Gallery</h4>
                <div className="sidebar-info">
                    <ul>
                        <PhotoProvider
                            speed={() => 800}
                            easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                        >
                            {GalleryData.map(gallery =>
                                <li key={gallery.id} className='widget-gallery'>
                                    <div className="single">
                                        <img src={`/assets/img/gallery/${gallery.thumb}`} alt="thumb" />
                                        <Link to="#" className='widget-link'>
                                            <PhotoView src={`/assets/img/gallery/${gallery.thumb}`} alt="image">
                                                <span className="widget-icon">
                                                    <i className="fas fa-plus"></i>
                                                </span>
                                            </PhotoView>
                                        </Link>
                                    </div>
                                </li>
                            )}
                        </PhotoProvider>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default GalleryWidget;