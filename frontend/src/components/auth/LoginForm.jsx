import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.login(formData.username, formData.password);
            
            // Get user profile to check admin status
            const userProfile = await authService.getProfile();
            
            toast.success('Login successful!');
            
            // Redirect based on admin status
            if (userProfile.is_admin) {
                navigate('/profile');
            } else {
                navigate('/explore');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="login-form-box">
                            <div className="form-header text-center">
                                <h2>Welcome Back</h2>
                                <p>Login to your account</p>
                            </div>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="username"
                                                placeholder="Username *"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="password"
                                                placeholder="Password *"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-submit"
                                        >
                                            {loading ? (
                                                <>
                                                    <i className="fa fa-spinner fa-spin" /> Logging in...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-sign-in" /> Login
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="col-lg-12 text-center mt-3">
                                        <p>
                                            Don't have an account?{' '}
                                            <Link to="/signup" className="text-primary">
                                                Sign up here
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
