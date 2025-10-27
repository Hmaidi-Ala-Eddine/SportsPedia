import PortfolioV3Data from "@/assets/jsonData/portfolio/PortfolioV3Data"
import SinglePortfolioV3 from "./SinglePortfolioV3";

const PortfolioV3 = () => {
    return (
        <>
            <div className="portfolio-style-three-area default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Recent Work</h4>
                                <h2 className="title">Featured Works.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt--100 mt-md--50 mt-xs--50">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row gutter-xl">
                                {PortfolioV3Data.map(portfolio =>
                                    <div className="col-lg-6 col-md-6 item-center" key={portfolio.id}>
                                        <SinglePortfolioV3 portfolio={portfolio} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    );
};

export default PortfolioV3;