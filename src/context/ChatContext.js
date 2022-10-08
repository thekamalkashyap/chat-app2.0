import { useContext, createContext, useReducer } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const initial = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    const combinedId =
      currentUser.uid > action.payload.uid
        ? currentUser.uid + action.payload.uid
        : action.payload.uid + currentUser.uid;

    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId: combinedId,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, initial);

  const value = {
    data: state,
    dispatch,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
