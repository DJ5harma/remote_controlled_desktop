"use client";
import { iceServers } from "@/lib/hardcoded";
import { socket } from "@/providers/SocketProvider";
import React, { useEffect, useRef, useState } from "react";
import VideoContainer from "./VideoContainer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Streams({
	didIWin,
	roomId,
}: {
	didIWin: boolean;
	roomId: string;
}) {
	const router = useRouter();
	let localStream: MediaStream;

	const localVideoElement = useRef<HTMLVideoElement>(null);
	const remoteVideoElement = useRef<HTMLVideoElement>(null);

	let pc: RTCPeerConnection | null = null;

	function addTracksToPeerConnection() {
		localStream.getTracks().forEach((track) => {
			pc?.addTrack(track, localStream);
		});
	}
	const startMyVideo = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		localStream = stream;
		localVideoElement.current.srcObject = stream;
		addTracksToPeerConnection();
	};

	const createPeerConnection = async () => {
		if (pc) {
			console.log("PC Already there --createPeerConnection");
			return;
		}
		pc = new RTCPeerConnection({ iceServers });
		console.log("created new PC");
	};

	async function startCall() {
		if (!pc) return console.log("pc undefined --startCall");

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		socket.emit("my-offerD", { offerD: pc.localDescription, roomId });
	}

	useEffect(() => {
		console.log("srcObj: " + remoteVideoElement.current.srcObject);
		// if(didIWin)
		createPeerConnection()
			.then(() => startMyVideo())
			.then(() => {
				if (didIWin) startCall();
			});
		if (!pc) return;

		pc.ontrack = (ev) => {
			remoteVideoElement.current.srcObject = ev.streams[0];
		};
		// listen for my own ice-candidate
		pc.onicecandidate = (ev) => {
			console.log("ice candidate inocoming from stun......");
			socket.emit("my-ice-candidate", { iceCandidate: ev.candidate, roomId });
		};
		pc.onconnectionstatechange = () => {
			console.log("Pc connection state changed to: " + pc.connectionState);
		};
		socket.on("incoming-offerD", async (offerD) => {
			console.log("offerD came", offerD);
			await pc?.setRemoteDescription(offerD);
			const answer = await pc?.createAnswer();
			await pc?.setLocalDescription(answer);
			socket.emit("my-answerD", { answerD: pc?.localDescription, roomId });
		});
		socket.on("incoming-answerD", async (answerD) => {
			console.log("answerD came", answerD);
			await pc?.setRemoteDescription(answerD);
		});

		socket.on("incoming-ice-candidate", async (iceCandidate) => {
			await pc?.addIceCandidate(iceCandidate); // check for new RTCIceCandidate(iceCandidate)
			console.log("ice-candidate arrived", iceCandidate);
		});
		socket.on("i-am-leaving", () => endCall());

		return () => {
			socket.removeAllListeners();
		};
	}, []);
	function endCall() {
		remoteVideoElement.current.srcObject = null;
		localVideoElement.current.srcObject = null;
		pc.close();
		router.push("/room");
		toast("Call was ended!");
	}
	return (
		<section>
			<div className="flex flex-row">
				<VideoContainer videoElement={localVideoElement} />
				<VideoContainer videoElement={remoteVideoElement} />
			</div>
			<div className="absolute bottom-5 right-5">
				<button className="bg-green-700" onClick={endCall}>
					End Call
				</button>
				{/* <a href="/">
					<button> End Call </button>
				</a> */}
			</div>
		</section>
	);
}
