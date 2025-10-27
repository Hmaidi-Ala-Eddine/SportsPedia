import { toast } from 'react-toastify';

const HeaderNewsLetter = () => {

    const handleForm = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks For Your Message")
    }

    return (
        <>
            <form onSubmit={handleForm}>
                <div className="input-group stylish-input-group">
                    <input type="email" placeholder="Enter your e-mail" className="form-control" name="email" autoComplete='off' required />
                    <span className="input-group-addon">
                        <button type="submit">
                            <i className="fas fa-long-arrow-right" />
                        </button>
                    </span>
                </div>
            </form>
        </>
    );
};

export default HeaderNewsLetter;