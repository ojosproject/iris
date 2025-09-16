/**
 * File:     WebcamRecorder.tsx
 * Purpose:  The webcam recorder.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import React, { useEffect, useRef, useState } from "react";
import styles from "./WebcamRecorder.module.css";
import { useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import { saveVideo } from "../_helper";

export default function WebcamRecorder() {
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
        className={styles.video_container}
        ref={videoRef}
        autoPlay
        playsInline
        muted={true}
      />
      {showDialog && (
        <Dialog
          title="You are still recording!"
          content="Recording will end if you leave the page. Leave the page?"
        >
          <button className="dangerPrimary" onClick={confirmDialog}>
            Leave page
          </button>
          <button className="primary" onClick={closeDialog}>
            Stay
          </button>
        </Dialog>
      )}
      <div className={styles.controls}>
        {/* Button to go back to the previous page */}
        <button
          className={isRecording ? "secondary" : "primary"}
          onClick={handleEnd}
        >
          Back
        </button>
        <button
          className={isRecording ? "secondary" : "primary"}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <button
          className={isCameraOn ? "secondary" : "primary"}
          onClick={toggleCamera}
        >
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
        <button
          className={isMicOn ? "secondary" : "primary"}
          onClick={toggleMute}
        >
          {isMicOn ? "Stop Mic" : "Start Mic"}
        </button>
      </div>
    </div>
  );
}
