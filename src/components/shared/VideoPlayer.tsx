"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
  src: string;
  poster?: string;
  className?: string;
  light?: boolean;
};

export default function VideoPlayer({ src, poster, className = "", light = true }: Props) {
  return (
    <div className={`relative w-full aspect-video bg-black ${className}`}>
      <ReactPlayer
        src={src}
        controls
        playing={!light}
        light={light ? poster ?? true : false}
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}
