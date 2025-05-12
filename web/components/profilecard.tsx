interface User {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-md transition hover:shadow-lg">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
        {user.firstName?.[0]?.toUpperCase() || "U"}
      </div>
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        {user.role && (
          <p className="text-sm mt-2 px-3 py-1 inline-block bg-blue-100 text-blue-600 rounded-full">
            {user.role}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
