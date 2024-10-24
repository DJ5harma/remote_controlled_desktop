"use client";
import { useEffect, useRef, useState } from "react";

export default function Page() {
	const userScreenRef = useRef<HTMLVideoElement>(null);
	const userCameraRef = useRef<HTMLVideoElement>(null);
	const [isMounted, setIsMounted] = useState(false); // State to track mounting

	useEffect(() => {
		setIsMounted(true); // Set to true after the component mounts
		if (typeof window === "undefined") return;

		navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((mediastream) => {
				userScreenRef.current!.srcObject = mediastream;
			})
			.catch(() => {
				setIsMounted(false);
			});
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((mediastream) => {
				userCameraRef.current!.srcObject = mediastream;
			})
			.catch(() => {
				setIsMounted(false);
			});
	}, []);

	return (
		<section className="flex-row">
			{isMounted && ( // Render video only on the client
				<>
					<video
						style={{ maxHeight: "90vh" }}
						ref={userScreenRef}
						autoPlay
						playsInline
					></video>
					<video
						style={{ maxHeight: "90vh" }}
						ref={userCameraRef}
						autoPlay
						playsInline
					></video>
				</>
			)}
		</section>
	);
}
