import React, { useEffect, useRef, useState } from "react"; // Import necessary hooks and components from React
import classes from "./controls.module.css"; // Import CSS module for styling
import { useRouter } from "next/navigation";
import Dialog from "./confirmMessage";
import { saveVideo } from "../helper";
import Button from "@/app/core/components/Button";

const WebcamRecorder: React.FC = () => {
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Reference to the MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // State to track if recording is in progress
  const [isRecording, setIsRecording] = useState(false);
  // State to store recorded video chunks
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const confirmDialog = () => {
    stopRecording(); // Stop recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setShowDialog(false); // Close the dialog
    router.push("/"); // Navigate to home page
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
    if (event.data.size > 0) {
      // Append recordings if it has data
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  // Function to start recording
  const startRecording = () => {
    setRecordedChunks([]); // Clear any previously recorded chunks
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start(); // Start the MediaRecorder
      setIsRecording(true); // Update recording state
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the MediaRecorder
      setIsRecording(false); // Update recording state
    }

    setRecordedChunks([]);
  };

  const toggleMute = () => {
    if (mediaRecorderRef.current?.stream) {
      const audioTracks = mediaRecorderRef.current.stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicOn; // Toggle audio track enabled state
      });
      console.log("muted state: ", isMicOn);
      setIsMicOn(!isMicOn); // Update muted state
    }
  };

  const toggleCamera = () => {
    if (mediaRecorderRef.current?.stream) {
      const videoTracks = mediaRecorderRef.current.stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isCameraOn; // Toggle video track enabled state
      });
      setIsCameraOn(!isCameraOn); // Update camera state
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

  if (recordedChunks && mediaRecorderRef.current?.state === "inactive") {
    saveVideo(new Blob(recordedChunks, { type: "video/mp4" }));
  }

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
      <div className={classes.controls}>
        {/* Button to go back to the previous page */}
        <Button
          type={isRecording ? "SECONDARY" : "PRIMARY"}
          label="Back"
          onClick={handleEnd}
        />
        {showDialog && (
          <Dialog
            title="You are still recording!"
            content="Current recording will be lost and cannot be recovered."
            onClose={closeDialog}
            onConfirm={confirmDialog}
          />
        )}
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

export default WebcamRecorder; // Export the WebcamRecorder component
