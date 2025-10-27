import handleSmoothScroll from '../utilities/handleSmoothScroll';
import { Link } from 'react-router-dom';

const ArchiveWidget = () => {
    return (
        <>
            <div className="sidebar-item archives">
                <h4 className="title">Archives</h4>
                <div className="sidebar-info">
                    <ul>
                        <li><Link to="#" onClick={handleSmoothScroll}>Aug 2023</Link></li>
                        <li><Link to="#" onClick={handleSmoothScroll}>Sept 2023</Link></li>
                        <li><Link to="#" onClick={handleSmoothScroll}>Nov 2023</Link></li>
                        <li><Link to="#" onClick={handleSmoothScroll}>Dec 2023</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ArchiveWidget;