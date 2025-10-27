import { Link } from 'react-router-dom';

const NotFoundContent = () => {
    return (
        <>
            <div className="error-page-area default-padding text-center bg-cover">
                <div className="shape-left" style={{ background: 'url(/assets/img/shape/44-left.png)' }} />
                <div className="shape-right" style={{ background: 'url(/assets/img/shape/44-right.png)' }} />
                <div className="container">
                    <div className="error-box">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <h1>404</h1>
                                <h2>Sorry Page Was Not Found!</h2>
                                <p>
                                    Household shameless incommode at no objection behaviour. Especially do at he possession insensible sympathize boisterous it. Songs he on an widen me event truth.
                                </p>
                                <Link className="btn mt-20 btn-md btn-theme" to="/">Back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundContent;