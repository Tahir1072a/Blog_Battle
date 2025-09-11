import defaultAvatar from "@/assets/images/default-avatar.jpg";

export function UserProfileHeader({ user }) {
  if (!user || !user.levelInfo) {
    return null;
  }

  const { levelInfo } = user;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
      <img
        src={defaultAvatar}
        alt="Profil"
        className="w-24 h-24 rounded-full border-4 border-gray-200"
      />
      <div>
        <h1 className="text-4xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <div className="mt-2 text-lg font-semibold text-blue-600 flex items-center gap-2">
          <span>{levelInfo.badge}</span>
          <span>
            {levelInfo.name} (Seviye {levelInfo.level})
          </span>
        </div>
      </div>
    </div>
  );
}
