"use client";

import { SOCKET_URL } from "@/lib/hardcoded";
import { io } from "socket.io-client";
export const socket = io(SOCKET_URL);
