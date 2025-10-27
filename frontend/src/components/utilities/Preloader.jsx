const Preloader = () => {
    return (
        <>
            <div id="preloader">
                <div id="gixus-preloader" className="gixus-preloader">
                    <div className="animation-preloader">
                        <div className="spinner" />
                        <div className="txt-loading">
                            <span data-text-preloader="G" className="letters-loading">
                                G
                            </span>
                            <span data-text-preloader="I" className="letters-loading">
                                I
                            </span>
                            <span data-text-preloader="X" className="letters-loading">
                                X
                            </span>
                            <span data-text-preloader="U" className="letters-loading">
                                U
                            </span>
                            <span data-text-preloader="S" className="letters-loading">
                                S
                            </span>
                        </div>
                    </div>
                    <div className="loader">
                        <div className="row">
                            <div className="col-3 loader-section section-left">
                                <div className="bg" />
                            </div>
                            <div className="col-3 loader-section section-left">
                                <div className="bg" />
                            </div>
                            <div className="col-3 loader-section section-right">
                                <div className="bg" />
                            </div>
                            <div className="col-3 loader-section section-right">
                                <div className="bg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Preloader;