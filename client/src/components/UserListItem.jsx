import { Avatar } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      className="flex items-center w-[450px] py-3 px-4 border-b-[0.1px] border-gray-800 gap-3 cursor-pointer hover:bg-[#374045]"
      onClick={handleFunction}
    >
      <Avatar src={user?.pic} sx={{ width: "55px", height: "55px" }} />
      <div className="gap-0.5 flex flex-col items-start justify-center">
        <span>{user?.name}</span>
        <span className="text-sm text-gray-400 font-[400]">{user?.email}</span>
      </div>
    </div>
  );
};

export default UserListItem;
