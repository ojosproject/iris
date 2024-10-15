"use client";
import { useState } from "react";
import classes from "./controls.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useRecordWebcam } from 'react-record-webcam';
import { v4 as uuid4 } from 'uuid';

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
    if (!recOn) {
      // Starting recording with unique id generated
      const newRecordingId = uuid4();
      setRecordingId(newRecordingId);

      try {
        const recording = await createRecording();
        console.log('Recording created:', recording);

        if (!recording) {
          console.error('Recording creation failed: No recording object returned');
          return;
        }

        await openCamera(recording.id); 
        await startRecording(recording.id);
        console.log('Recording started with ID:', recording.id);
        setRecOn(true);
      } catch (error) {
        console.error('Error during recording process:', error);
      }
    } else {
      try {
        if (!recordingId) {
          console.error('Error: No recording ID available to stop recording.');
          return;
        }
        
        const recordedBlob = await stopRecording(recordingId!); // recording id is not being recognized here, giving a error
        console.log('Recording stopped.');

        if (recordedBlob instanceof Blob) {
          const recordingUrl = URL.createObjectURL(recordedBlob);
          setVideoUrl(recordingUrl);
          console.log('Recording URL set:', recordingUrl);
        } else {
          console.error('Error: Recorded blob is not an instance of Blob:', recordedBlob);
        }
        await download(recordingId!);
        console.log('Recording downloaded.');
      } catch (error) {
        console.error('Error stopping recording:', error);
      } finally {
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
