import FeatureV2Data from "@/assets/jsonData/feature/FeatureV2Data.json"
import SingleFeatureV2 from "./SingleFeatureV2";

const FeatureV2 = () => {
    return (
        <>
            <div className="features-style-two-area default-padding bottom-less bg-gray">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Our Features</h4>
                                <h2 className="title">Our goal is giving the best our customers</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {FeatureV2Data.map(feature =>
                            <div className="col-xl-4 col-md-6 feature-style-two-item" key={feature.id}>
                                <SingleFeatureV2 feature={feature} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default FeatureV2;