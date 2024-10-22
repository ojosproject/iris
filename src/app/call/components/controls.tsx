import React, { useEffect, useRef, useState } from 'react'; // Import necessary hooks and components from React
import clsx from "clsx"; // Import clsx for conditional class names
import classes from "./controls.module.css"; // Import CSS module for styling
import { useRouter } from 'next/navigation';
import Dialog from './confirmMessage';

const WebcamRecorder: React.FC = () => {
  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Reference to the MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // State to track if recording is in progress
  const [recording, setRecording] = useState(false);
  // State to store recorded video chunks
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const confirmDialog = () => {
    stopRecording(); // Stop recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
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
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on component mount

  // Handler for when data is available from the MediaRecorder
  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      // Append recordings if it has data
      setRecordedChunks(prev => [...prev, event.data]);
    }
  };

  // Function to start recording
  const startRecording = () => {
    setRecordedChunks([]); // Clear any previously recorded chunks
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start(); // Start the MediaRecorder
      setRecording(true); // Update recording state
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the MediaRecorder
      setRecording(false); // Update recording state
    }
  };

  // Function to download the recorded video
  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' }); // Create a Blob from the recorded chunks
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = url; // Set the href to the Blob URL
    a.download = 'recording.webm'; // Set the download filename
    a.click(); // Programmatically click the anchor to trigger the download
    URL.revokeObjectURL(url); // Cleanup the URL object
  };

  const toggleMute = () => {
    if (mediaRecorderRef.current?.stream) {
      const audioTracks = mediaRecorderRef.current.stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMuted; // Toggle audio track enabled state
      });
      console.log("muted state: ", isMuted);
      setIsMuted(!isMuted); // Update muted state
    }
  };

  const toggleCamera = () => {
    if (mediaRecorderRef.current?.stream) {
      const videoTracks = mediaRecorderRef.current.stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn; // Toggle video track enabled state
      });
      setIsCameraOn(!isCameraOn); // Update camera state
    }
  };

  // Function to handle ending the recording and cleanup
  const handleEnd = () => {
    if (recording) {
      setShowDialog(!showDialog);
    } else {
      router.push("/")
    }
  };

  return (
    <div>
      {/* Video element to display the webcam feed */}
      <video ref={videoRef} autoPlay playsInline width="900" height="700"></video>
      <div className={classes.controls}>
        {/* Button to go back to the previous page */}
        <button
          className={clsx(classes.normalButton)}
          onClick={handleEnd}
        >
          Go Back
        </button>
        {showDialog && (
        <Dialog 
          title="You are still recording!"
          content="Current recording will be lost and cannot be recovered."
          onClose={closeDialog}
          onConfirm={confirmDialog}
        />
        )}
        {/* Conditional button to start or stop recording */}
        {!recording ? (
          <button className ={clsx(classes.normalButton)} onClick={startRecording}>Start Recording</button>
        ) : (
          <button className ={clsx(classes.normalButton)} onClick={stopRecording}>Stop Recording</button>
        )}
        <button
          className={clsx(classes.normalButton)}
          onClick={toggleCamera}
        >
        {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>
        <button
          className={clsx(classes.normalButton)}
          onClick={toggleMute}
        >
        {isMuted ? "Mute" : "Unmute"}
        </button>
        {/* Button to download the video if there are recorded chunks */}
        {recordedChunks.length > 0 && (
          <button className ={clsx(classes.normalButton)} onClick={downloadVideo}>Download Video</button>
        )}
      </div>
    </div>
  );
};

export default WebcamRecorder; // Export the WebcamRecorder component
