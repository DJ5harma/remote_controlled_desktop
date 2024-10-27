import { Resizable } from "re-resizable";
import React, { CSSProperties, MutableRefObject } from "react";
import Draggable from "react-draggable";

export default function VideoContainer({
	videoElement,
	style,
}: {
	videoElement: MutableRefObject<HTMLVideoElement>;
	style?: CSSProperties;
}) {
	return (
		<Draggable>
			<Resizable defaultSize={{ height: 400, width: 450 }}>
				<video
					src=""
					ref={videoElement}
					className="border-2 border-white absolute"
					playsInline
					autoPlay
					style={style}
				>npm
					<track kind="captions" />
				</video>
			</Resizable>
		</Draggable>
	);
}
