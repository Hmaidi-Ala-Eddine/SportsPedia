import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const ProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authService.getProfile();
            setProfile(data);
            setFormData({
                email: data.email,
                fullName: data.full_name || '',
                password: ''
            });
        } catch (error) {
            toast.error('Failed to load profile');
            if (error.message.includes('authentication')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

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
            const updateData = {
                email: formData.email,
                full_name: formData.fullName
            };

            if (formData.password) {
                if (formData.password.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                updateData.password = formData.password;
            }

            const updatedProfile = await authService.updateProfile(updateData);
            setProfile(updatedProfile);
            setEditing(false);
            setFormData({ ...formData, password: '' });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    if (loading && !profile) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
                    <p style={{ marginTop: '20px', color: '#64748b', fontSize: '18px' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Profile Header Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '25px',
                            padding: '40px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px',
                                boxShadow: '0 15px 40px rgba(102,126,234,0.4)'
                            }}>
                                <i className="fas fa-user-circle" style={{ fontSize: '70px', color: 'white' }}></i>
                            </div>

                            {/* Username */}
                            <h2 style={{
                                fontSize: '36px',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '8px'
                            }}>
                                {profile?.username}
                            </h2>

                            {/* Member Since */}
                            <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
                                <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                Member since {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {!editing ? (
                            <div>
                                {/* Profile Details Card */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '25px',
                                    padding: '40px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    marginBottom: '25px'
                                }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' }}>
                                        <i className="fas fa-info-circle" style={{ marginRight: '12px', color: '#667eea' }}></i>
                                        Profile Information
                                    </h3>

                                    {/* Email */}
                                    <div style={{
                                        padding: '20px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        marginBottom: '15px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>
                                            <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            Email
                                        </label>
                                        <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600', margin: 0 }}>
                                            {profile?.email}
                                        </p>
                                    </div>

                                    {/* Full Name */}
                                    <div style={{
                                        padding: '20px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        marginBottom: '15px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>
                                            <i className="fas fa-user" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            Full Name
                                        </label>
                                        <p style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600', margin: 0 }}>
                                            {profile?.full_name || 'Not provided'}
                                        </p>
                                    </div>

                                    {/* Account Status */}
                                    <div style={{
                                        padding: '20px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>
                                            <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            Account Status
                                        </label>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            background: profile?.is_active ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: 'white'
                                        }}>
                                            {profile?.is_active ? '✓ Active' : '✗ Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{
                                            padding: '15px 35px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <i className="fas fa-edit" style={{ marginRight: '8px' }}></i>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            padding: '15px 35px',
                                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 25px rgba(239,68,68,0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                background: 'white',
                                borderRadius: '25px',
                                padding: '40px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' }}>
                                    <i className="fas fa-edit" style={{ marginRight: '12px', color: '#667eea' }}></i>
                                    Edit Profile
                                </h3>

                                <form onSubmit={handleSubmit}>
                                    {/* Email Field */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                                            <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
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

                                    {/* Full Name Field */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                                            <i className="fas fa-user" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
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
                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                                            <i className="fas fa-lock" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Leave blank to keep current password"
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
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', marginBottom: 0 }}>
                                            Minimum 6 characters
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                padding: '15px 35px',
                                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                                            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
                                        >
                                            {loading ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    email: profile.email,
                                                    fullName: profile.full_name || '',
                                                    password: ''
                                                });
                                            }}
                                            style={{
                                                padding: '15px 35px',
                                                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 25px rgba(100,116,139,0.3)',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                        >
                                            <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
