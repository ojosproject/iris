import React, { useEffect, useState } from 'react';

function WebcamCapture() {
  const [webcamId, setWebcamId] = useState('');

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const webcam = devices.find((device) => device.kind === 'videoinput');
        if (webcam) {
          setWebcamId(webcam.deviceId);
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, []);

  return webcamId;
}

export default WebcamCapture;