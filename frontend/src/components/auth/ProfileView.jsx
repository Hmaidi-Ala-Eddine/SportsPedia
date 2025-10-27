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
            <div className="profile-area text-center" style={{ padding: '100px 0' }}>
                <i className="fa fa-spinner fa-spin fa-3x" />
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="profile-box">
                            <div className="profile-header text-center">
                                <div className="profile-avatar">
                                    <i className="fa fa-user-circle fa-5x" />
                                </div>
                                <h2>{profile?.username}</h2>
                                <p className="text-muted">
                                    Member since {new Date(profile?.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {!editing ? (
                                <div className="profile-details">
                                    <div className="detail-item">
                                        <label><i className="fa fa-envelope" /> Email</label>
                                        <p>{profile?.email}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label><i className="fa fa-user" /> Full Name</label>
                                        <p>{profile?.full_name || 'Not provided'}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label><i className="fa fa-shield" /> Account Status</label>
                                        <p>
                                            <span className={`badge ${profile?.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {profile?.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="profile-actions text-center mt-4">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="btn btn-primary me-3"
                                        >
                                            <i className="fa fa-edit" /> Edit Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-danger"
                                        >
                                            <i className="fa fa-sign-out" /> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form mt-4">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    className="form-control"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>New Password (leave blank to keep current)</label>
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 text-center">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn btn-success me-3"
                                            >
                                                {loading ? (
                                                    <>
                                                        <i className="fa fa-spinner fa-spin" /> Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa fa-save" /> Save Changes
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
                                                className="btn btn-secondary"
                                            >
                                                <i className="fa fa-times" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
