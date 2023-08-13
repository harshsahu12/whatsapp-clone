import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import { Avatar } from '@mui/material';

const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleTimeString(undefined, options);
};

const Messages = ({ messages }) => {
    const { user } = ChatState();
    return (
        <div>
            {messages &&
                messages.map((m, i) => (
                    <div className='flex my-1' key={m._id}>
                        {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <Avatar style={{ fontSize: '25px' }} src={m.sender.pic} />
                        )}
                        <span
                            style={{
                                marginLeft: `${isSameSenderMargin(
                                    messages,
                                    m,
                                    i,
                                    user._id
                                )}`
                            }}
                            className={`text-md font-normal py-1.5 px-2 rounded-md text-white ${m.sender._id === user._id ? 'bg-[#005C4B]' : 'bg-[#1D282F]'}`}
                        >
                            {m.content}
                            <span className='text-[12px] ml-2 text-gray-300 font-thin'>
                                {formatTime(m.createdAt)}
                            </span>
                        </span>
                    </div>
                ))}
        </div>
    );
};

export default Messages;
