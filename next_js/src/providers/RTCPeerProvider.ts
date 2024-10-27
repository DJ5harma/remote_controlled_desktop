// import { iceServers } from "@/lib/hardcoded";

// let PC: RTCPeerConnection | null = null;
// export const pc = {
// 	createPC: () => {
// 		if (PC) {
// 			console.log("PC Already created");
// 			return;
// 		}
// 		PC = new RTCPeerConnection({ iceServers });
// 	},
// 	sendTrackToPeer: (track: MediaStreamTrack, localStream: MediaStream) => {
//     if(!PC) return console.log("No PC created Yet")
// 		PC?.addTrack(track, localStream);
// 	},
// 	handleOfferCreation: () => {

//   },

// 	// add local streams to PC
// 	// listen remote streams and add to PC
// 	// listen for ice candidate
// };
