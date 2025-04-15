// controls.tsx
// Ojos Project
import React, { useEffect, useRef, useState } from "react";
import classes from "./controls.module.css";
import { useRouter } from "next/navigation";
import Dialog from "./confirmMessage";
import { saveVideo } from "../helper";
import Button from "@/app/components/Button";

const WebcamRecorder: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const confirmDialog = () => {
    stopRecording();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setShowDialog(false);
    router.push("/");
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    // Function to start video streaming
    const startVideo = async () => {
      try {
        // Request access to the user's webcam and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Set the video stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Initialize MediaRecorder with the stream
        mediaRecorderRef.current = new MediaRecorder(stream);
        // Set up the data available handler to process recorded chunks
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      } catch (error) {
        console.error("Error accessing the webcam:", error);
      }
    };

    startVideo(); // Call the startVideo function to initiate streaming
    return () => {
      // Cleanup function to stop all media tracks when component unmounts
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on component mount

  // Handler for when data is available from the MediaRecorder
  const handleDataAvailable = (event: BlobEvent) => {
    saveVideo(new Blob([event.data], { type: "video/mp4" }));
  };

  // Function to start recording
  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleMute = () => {
    if (mediaRecorderRef.current?.stream) {
      const audioTracks = mediaRecorderRef.current.stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicOn; // Toggle audio track enabled state
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (mediaRecorderRef.current?.stream) {
      const videoTracks = mediaRecorderRef.current.stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isCameraOn; // Toggle video track enabled state
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Function to handle ending the recording and cleanup
  const handleEnd = () => {
    if (isRecording) {
      setShowDialog(!showDialog);
    } else {
      router.push("/");
    }
  };

  return (
    <div>
      {/* Video element to display the webcam feed */}
      <video
        className={classes.video_container}
        ref={videoRef}
        autoPlay
        playsInline
        muted={true}
      />
      {showDialog && (
        <Dialog
          title="You are still recording!"
          content="Recording will end if you leave the page. Leave the page?"
          onClose={closeDialog}
          onConfirm={confirmDialog}
        />
      )}
      <div className={classes.controls}>
        {/* Button to go back to the previous page */}
        <Button
          type={isRecording ? "SECONDARY" : "PRIMARY"}
          label="Back"
          onClick={handleEnd}
        />
        <Button
          type={isRecording ? "SECONDARY" : "PRIMARY"}
          label={isRecording ? "Stop Recording" : "Start Recording"}
          onClick={isRecording ? stopRecording : startRecording}
        />

        <Button
          type={isCameraOn ? "SECONDARY" : "PRIMARY"}
          label={isCameraOn ? "Stop Camera" : "Start Camera"}
          onClick={toggleCamera}
        />
        <Button
          type={isMicOn ? "SECONDARY" : "PRIMARY"}
          label={isMicOn ? "Stop Mic" : "Start Mic"}
          onClick={toggleMute}
        />
      </div>
    </div>
  );
};

export default WebcamRecorder;
