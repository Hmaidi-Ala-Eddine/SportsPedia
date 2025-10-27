import { toast } from 'react-toastify';

const BlogCommentForm = () => {

    const handleForm = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks For Your Message")
    }

    return (
        <>
            <form className="contact-comments" onSubmit={handleForm}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input name="name" className="form-control" placeholder="Name *" type="text" required autoComplete='off' />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input name="email" className="form-control" placeholder="Email *" type="email" required autoComplete='off' />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group comments">
                            <textarea className="form-control" name='textarea' placeholder="Comment" required autoComplete='off' />
                        </div>
                        <div className="form-group full-width submit">
                            <button className="btn btn-theme effect" type="submit">Post Comment</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default BlogCommentForm;