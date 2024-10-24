"use client";
import { getSocket } from "@/socketClient/socket";
import React from "react";
export default function Page() {
	const skt = getSocket();
	const sendMouseEvent = (event: React.MouseEvent) => {
		const { clientX, clientY } = event;
		skt!.emit("mouse-move", { clientX, clientY });
	};

	return (
		<div
			onMouseMove={sendMouseEvent}
			style={{ width: "100%", height: "100%", border: "1px solid black" }}
		>
			Control Here
		</div>
	);
}
