import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authService.signup(
                formData.username,
                formData.email,
                formData.fullName,
                formData.password
            );
            toast.success('Account created successfully! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-form-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="signup-form-box">
                            <div className="form-header text-center">
                                <h2>Create Account</h2>
                                <p>Join SportsPedia today</p>
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
                                                type="email"
                                                name="email"
                                                placeholder="Email *"
                                                value={formData.email}
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
                                                type="text"
                                                name="fullName"
                                                placeholder="Full Name"
                                                value={formData.fullName}
                                                onChange={handleChange}
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
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Confirm Password *"
                                                value={formData.confirmPassword}
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
                                                    <i className="fa fa-spinner fa-spin" /> Creating account...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-user-plus" /> Sign Up
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="col-lg-12 text-center mt-3">
                                        <p>
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-primary">
                                                Login here
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

export default SignupForm;
