import AppLayout from "../../components/AppLayout";

const Profile = () => {
  return (
    <AppLayout>
      <h1>Profile</h1>
    </AppLayout>
  );
};

export default Profile;

Profile.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['creator', 'member'],
  }
}