"use client";
import { useState } from "react";
import classes from "./controls.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useRecordWebcam } from 'react-record-webcam';

interface ControlsProps {
  camOn: boolean;
  setCamOn: (state: boolean) => void;
  micOn: boolean;
  setMicOn: (state: boolean) => void;
}

export default function Controls({
  camOn,
  setCamOn,
  micOn,
  setMicOn,
}: ControlsProps) {
  const [recOn, setRecOn] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const router = useRouter();

  const { createRecording, openCamera, startRecording, stopRecording, download } = useRecordWebcam();

  const handleRecordVideo = async () => {
    setRecOn(!recOn)
    if (!recOn) {
      try {
        // Create recording
        const recording = await createRecording();
        console.log('Recording created:', recording);
        
        // Check if recording ID exists
        if (!recording) {
          console.error('Recording creation failed: No recording object returned');
          return;
        }
  
        // Set the recording ID to state
        setRecordingId(recording.id);
        console.log("recordingID here: ", recording.id);
        console.log("status: ", recording.status);
  
        // Open the camera and start recording
        await openCamera(recording.id);
        await startRecording(recording.id);
        await startRecording(recording.id);
        console.log('Recording started with ID:', recording.status);

      } catch (error) {
        console.error('Error during recording process:', error);
      }
    } else {
      console.log("stopping here")
      try {
        console.log("record id: ", recordingId)
        if (!recordingId) {
          console.error('Error: No recording ID available to stop recording.');
          return;
        }
  
        // Stop recording
        console.log("reached here")
        const recordedBlob = await stopRecording(recordingId);
        console.log('Recording stopped.');
  
        // Check if the recorded blob is valid
        if (recordedBlob instanceof Blob) {
          const recordingUrl = URL.createObjectURL(recordedBlob);
          setVideoUrl(recordingUrl);
          console.log('Recording URL set:', recordingUrl);
        } else {
          console.error('Error: Recorded blob is not an instance of Blob:', recordedBlob);
        }
  
        // Download the recording
        await download(recordingId);
        console.log('Recording downloaded.');
      } catch (error) {
        console.error('Error stopping recording:', error);
      } finally {
        // Reset the recording state
        setRecOn(false);
        setRecordingId(null);
      }
    }
  };
  

  return (
    <div className={classes.controls}>
      <button
        className={clsx(classes.normalButton)}
        onClick={() => router.push("/")}
      >
        End
      </button>
      <button
        className={clsx(classes.normalButton, !micOn && classes.invert)}
        onClick={() => setMicOn(!micOn)}
      >
        {micOn ? "Mute" : "Unmute"}
      </button>
      <button
        className={clsx(classes.normalButton, !camOn && classes.invert)}
        onClick={() => setCamOn(!camOn)}
      >
        {camOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>
      <button
        className={clsx(classes.normalButton, !recOn && classes.invert)}
        onClick={handleRecordVideo}
      >
        {recOn ? "Stop Recording" : "Record"}
      </button>

      {videoUrl && (
        <div>
          <video controls src={videoUrl} />
        </div>
      )}
    </div>
  );
}
