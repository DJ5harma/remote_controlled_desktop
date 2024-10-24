"use client";
import { getSocket } from "@/socketClient/socket";
import { useEffect, useRef } from "react";

export default function Page() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const peerRef = useRef<RTCPeerConnection | null>(null);
	const skt = getSocket();

	const startScreenShare = async () => {
		const stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
		}); //screen capture
		videoRef.current!.srcObject = stream;

		// Initialize Peer Connection
		peerRef.current = new RTCPeerConnection();

		// Add each track from the stream (in this case, just video) to the WebRTC connection
		stream.getTracks().forEach((track) => {
			peerRef.current!.addTrack(track, stream);
		});

		// Create an offer and send it to the signaling server
		const offer = await peerRef.current!.createOffer();
		await peerRef.current!.setLocalDescription(offer);
		skt.emit("offer", offer);
	};

	const handleOffer = async (offer: RTCSessionDescriptionInit) => {
		if (!peerRef.current) {
			peerRef.current = new RTCPeerConnection();
			peerRef.current.ontrack = (event) => {
				videoRef.current!.srcObject = event.streams[0];
			};
		}
		await peerRef.current.setRemoteDescription(offer);
		const answer = await peerRef.current.createAnswer();
		await peerRef.current.setLocalDescription(answer);
		skt.emit("answer", answer);
	};

	const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
		await peerRef.current!.setRemoteDescription(answer);
	};

	const handleICECandidate = async (candidate: RTCIceCandidateInit) => {
		await peerRef.current!.addIceCandidate(candidate);
	};

	const sendICECandidate = (candidate: RTCIceCandidateInit) => {
		skt.emit("ice-candidate", candidate);
	};

	useEffect(() => {
		// Socket event handlers for signaling
		skt.on("offer", handleOffer);
		skt.on("answer", handleAnswer);
		skt.on("ice-candidate", handleICECandidate);

		return () => {
			skt.off("offer", handleOffer);
			skt.off("answer", handleAnswer);
			skt.off("ice-candidate", handleICECandidate);
		};
	}, []);

	return (
		<section className="gap-2">
			<h1>Video Call Page</h1>
			<video ref={videoRef} autoPlay />
			<button onClick={startScreenShare}>Share Screen</button>
		</section>
	);
}
