import handleSmoothScroll from '../utilities/handleSmoothScroll';
import { Link } from 'react-router-dom';

const TagsWidget = () => {
    return (
        <>
            <div className="sidebar-item tags">
                <h4 className="title">tags</h4>
                <div className="sidebar-info">
                    <ul>
                        <li><Link to="#" onClick={handleSmoothScroll}>Fashion</Link>
                        </li>
                        <li><Link to="#" onClick={handleSmoothScroll}>Education</Link>
                        </li>
                        <li><Link to="#" onClick={handleSmoothScroll}>nation</Link>
                        </li>
                        <li><Link to="#" onClick={handleSmoothScroll}>study</Link>
                        </li>
                        <li><Link to="#" onClick={handleSmoothScroll}>health</Link>
                        </li>
                        <li><Link to="#" onClick={handleSmoothScroll}>travel</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default TagsWidget;