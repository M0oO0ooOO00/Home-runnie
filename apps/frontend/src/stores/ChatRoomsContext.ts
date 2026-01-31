'use client';

import { createContext, useContext } from 'react';
import { ChatRoomResponse } from '@homerunnie/shared';

export const ChatRoomsContext = createContext<Map<string, ChatRoomResponse>>(new Map());

export const useChatRooms = () => useContext(ChatRoomsContext);
