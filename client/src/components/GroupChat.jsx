import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import UserListItem from './UserListItem';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { toast } from 'react-toastify';
import UserAdded from './UserAdded';
import { SERVERURL } from '../config/helper';

const GroupChat = ({ onClick }) => {
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.error('User already added');
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${SERVERURL}/user?search=${query}`, config);

            const filteredUsers = data.filter(u => u._id !== user._id);
          
            setSearchResult(filteredUsers);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!groupChatName || selectedUsers.length === 0) {
            toast.error('Please fill all the fields');
            return;
        }

        if (selectedUsers.length <= 1) {
            toast.warn("Group should have more than 1 user")
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${SERVERURL}/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
        
            setChats([data, ...chats]);
            toast.success('New group created');
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    return (
        <div className="flex-[0.3] w-[450px] flex-col justify-center items-center border-r border-gray-800 animate-dropdown open">
            <div className="flex items-center pt-[60px] pb-[10px] pl-[20px] text-xl text-gray-300 font-[500] bg-[#202c33] gap-5">
                <IconButton onClick={onClick}>
                    <ArrowBack sx={{ fontSize: '25px', color: 'lightgray' }} />
                </IconButton>
                New group
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex flex-col items-center justify-center my-5">
                    <div className="grid grid-cols-3">
                        {selectedUsers.map((u) => (
                            <UserAdded
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </div>
                    <input
                        onChange={(e) => setGroupChatName(e.target.value)}
                        type="text"
                        className="outline-none placeholder:text-base text-[#aebac1] mt-5 w-[370px] font-[350] bg-transparent border-b-[0.1px] border-gray-700"
                        placeholder="Enter group name"
                    />
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        className="outline-none placeholder:text-base text-[#aebac1] mt-10 w-[370px] font-[350] bg-transparent border-b-[0.1px] border-gray-700"
                        placeholder="Search user to add"
                    />
                    {selectedUsers.length > 0 && (
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: '0',
                                borderRadius: '50%',
                                backgroundColor: '#00a884',
                            }}
                            type="submit"
                        >
                            <ArrowForward sx={{ fontSize: '30px', color: 'white' }} />
                        </IconButton>
                    )}
                </div>
            </form>
            {searchResult.slice(0, 5).map((searchUser) => (
                <UserListItem
                    key={searchUser._id}
                    user={searchUser}
                    handleFunction={() => handleGroup(searchUser)}
                />
            ))}
        </div>
    );
};

export default GroupChat;
