import ProfileView from '@/components/auth/ProfileView';
import LayoutV5 from '@/components/layouts/LayoutV5';

const ProfilePage = () => {
    return (
        <>
            <LayoutV5 breadCrumb="profile" title="My Profile">
                <ProfileView />
            </LayoutV5>
        </>
    );
};

export default ProfilePage;
