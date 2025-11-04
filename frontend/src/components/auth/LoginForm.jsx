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
            
            toast.success('🎉 Welcome back!');
            
            // Redirect based on admin status
            if (userProfile.is_admin) {
                navigate('/admin');  // Redirect admins to admin panel
            } else {
                navigate('/');  // Redirect to home page
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div style={{
                            background: 'white',
                            borderRadius: '25px',
                            padding: '50px 40px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {/* Logo/Icon */}
                            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: '0 10px 30px rgba(102,126,234,0.4)'
                                }}>
                                    <i className="fas fa-user-circle" style={{ fontSize: '40px', color: 'white' }}></i>
                                </div>
                                <h2 style={{ 
                                    fontSize: '32px', 
                                    fontWeight: '900',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '8px'
                                }}>
                                    Welcome Back!
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
                                    Login to continue to SportsPedia
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Username Field */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        color: '#1e293b', 
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Password Field */}
                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        color: '#1e293b', 
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-lock" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 10px 25px rgba(102,126,234,0.3)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                                    onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                                            Login
                                        </>
                                    )}
                                </button>

                                {/* Sign Up Link */}
                                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                                        Don't have an account?{' '}
                                        <Link 
                                            to="/signup" 
                                            style={{ 
                                                color: '#667eea', 
                                                fontWeight: '700',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Sign up here
                                        </Link>
                                    </p>
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
