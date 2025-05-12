interface User {
  name: string;
  email: string;
  role: string;
}

const ProfileCard = ({ user }: { user: User }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg p-4">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  };
  
  export default ProfileCard;
  