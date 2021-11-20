
const  AccessDenied = () => {
    return (
        <h1>Access Denied</h1>
    );}

export default AccessDenied;



AccessDenied.defaultProps = {
    auth: {
      isPublic: true,
    }
};
  