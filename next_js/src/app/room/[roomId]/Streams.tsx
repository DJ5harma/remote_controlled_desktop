import { iceServers } from "@/lib/hardcoded";
import { useRoom } from "@/providers/RoomProvider";
import { socket } from "@/providers/SocketProvider";
import React, { useCallback, useEffect, useRef } from "react";

export default function Streams({ didIWin }: { didIWin: boolean }) {
	const { room } = useRoom();
	const { roomId } = room;

	const localCamera = useRef<HTMLVideoElement>(null);
	const remoteCamera = useRef<HTMLVideoElement>(null);

	const pc = useRef<RTCPeerConnection>(null);

	const startMyVideo = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		localCamera.current.srcObject = stream;
		stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
	}, []);

	const createPeerConnection = useCallback(async () => {
		if (pc) {
			console.log("PC Already there --createPeerConnection");
			return;
		}
		pc.current = new RTCPeerConnection({ iceServers });
	}, []);

	async function startCall() {
		if (!pc) return console.log("pc undefined --startCall");

		const offer = await pc.current.createOffer();
		await pc.current.setLocalDescription(offer);
		socket.emit("my-offerD", { offerD: pc.current.localDescription, roomId });
	}

	useEffect(() => {
		if (!pc) return;
		createPeerConnection().then(startMyVideo);
		if (didIWin) {
			socket.on("incoming-answerD", async (answerD) => {
				console.log("answerD came", answerD);
				await pc.current.setRemoteDescription(answerD);
			});
		} else {
			socket.on("incoming-offerD", async (offerD) => {
				console.log("offerD came", offerD);
				await pc.current.setRemoteDescription(offerD);
				const answer = await pc.current.createAnswer();
				await pc.current.setLocalDescription(answer);
				socket.emit("my-answerD", {
					answerD: pc.current.localDescription,
					roomId,
				});
			});
		}
		// listen to remote stream
		pc.current.ontrack = (ev) =>
			(remoteCamera.current.srcObject = ev.streams[0]);

		// listen for my own ice-candidate
		pc.current.onicecandidate = (ev) =>
			socket.emit("my-ice-candidate", {
				iceCandidate: ev.candidate,
				roomId,
			});

		socket.on("incoming-ice-candidate", async (iceCandidate) => {
			await pc.current.addIceCandidate(iceCandidate); // check for new RTCIceCandidate(iceCandidate)
			console.log("ice-candidate arrived", iceCandidate);
		});
		return () => {
			socket.removeAllListeners();
			pc.current.close();
		};
	}, [createPeerConnection, didIWin, pc, roomId, startMyVideo]);
	return (
		<section className="[&>video]:w-56">
			<video
				src=""
				ref={localCamera}
				className="border-2 border-white"
				playsInline
				autoPlay
			>
				<track kind="captions" />
			</video>
			<video
				src=""
				ref={remoteCamera}
				className="border-2 border-white"
				playsInline
				autoPlay
			>
				<track kind="captions" />
			</video>
			<div>
				<button className="bg-green-700" onClick={startCall}>
					Start Call
				</button>
				<a href="/">
					<button> Go Home </button>
				</a>
			</div>
		</section>
	);
}
