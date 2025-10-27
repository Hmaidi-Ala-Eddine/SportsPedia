import shape29 from "/assets/img/shape/29.png"
import { toast } from 'react-toastify';
import VideoBg1 from '../videos/VideoBg1';

const QuoteV1 = () => {

    const handleForm = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks For Your Quote")
    }

    return (
        <>
            <div className="quote-style-one-area video-bg-live default-padding-top" style={{ backgroundImage: 'url(/assets/img/banner/18.jpg)' }}>
                <div className="shape">
                    <img src={shape29} alt="Image Not Found" />
                </div>
                <VideoBg1 />
                <div className="container" style={{ position: "relative" }}>
                    <div className="row">
                        <div className="quote-text">
                            <h1>Quote</h1>
                        </div>
                        <div className="col-xl-5 offset-xl-7 col-lg-6 offset-lg-6">
                            <div className="quote-style-one">
                                <h2 className="title">Request A Quote</h2>
                                <p>
                                    Our friendly team would love to hear from you!
                                </p>
                                <form onSubmit={handleForm}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="f-name" name="f-name" placeholder="First Name" type="text" autoComplete='off' required />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="l-name" name="l-name" placeholder="Last Name" type="text" autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input className="form-control" id="email" name="email" placeholder="Email" type="email" autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input className="form-control" id="phone" name="phone" placeholder="Phone Number" type="text" autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group comments">
                                                <textarea className="form-control" id="comments" name="comments" placeholder="Tell Us About Project *" autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <button type="submit" name="submit" id="submit">
                                                Get a Quote
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuoteV1;