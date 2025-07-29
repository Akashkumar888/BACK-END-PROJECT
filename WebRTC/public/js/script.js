const socket = io();

let local;
let remote;
let peerConnection;
let screenStream;
let micMuted = false;
let cameraOff = false;

const rtcSettings = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const initialize = async () => {
  socket.on('signalingMessage', handleSignalingMessage);

  local = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  document.querySelector('#localVideo').srcObject = local;

  if (window.location.hash === '#caller') {
    initiateOfUser();
  }
};

const initiateOfUser = async () => {
  await createPeerConnection();
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('signalingMessage', JSON.stringify({ type: 'offer', offer }));
};

const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection(rtcSettings);

  remote = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remote;
  document.querySelector('#remoteVideo').style.display = 'block';
  document.querySelector('#localVideo').classList.add('smallFrame');

  local.getTracks().forEach(track => {
    peerConnection.addTrack(track, local);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remote.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('signalingMessage', JSON.stringify({
        type: 'candidate',
        candidate: event.candidate,
      }));
    }
  };
};

const handleSignalingMessage = async (message) => {
  const { type, offer, answer, candidate } = JSON.parse(message);

  if (type === 'offer') handleOffer(offer);
  if (type === 'answer') handleAnswer(answer);
  if (type === 'candidate' && peerConnection) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};

const handleOffer = async (offer) => {
  await createPeerConnection();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit('signalingMessage', JSON.stringify({ type: 'answer', answer }));
};

const handleAnswer = async (answer) => {
  if (!peerConnection.currentRemoteDescription) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
};

document.getElementById('micButton').addEventListener('click', () => {
  local.getAudioTracks().forEach(track => {
    track.enabled = !track.enabled;
    micMuted = !track.enabled;
  });
  alert(micMuted ? 'Microphone Muted' : 'Microphone Unmuted');
});

document.getElementById('cameraButton').addEventListener('click', () => {
  local.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
    cameraOff = !track.enabled;
  });
  alert(cameraOff ? 'Camera Off' : 'Camera On');
});

document.getElementById('screenShareButton').addEventListener('click', async () => {
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getVideoTracks()[0];

    const sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
    if (sender) sender.replaceTrack(screenTrack);

    document.querySelector('#localVideo').srcObject = screenStream;

    screenTrack.onended = () => {
      const videoTrack = local.getVideoTracks()[0];
      if (sender) sender.replaceTrack(videoTrack);
      document.querySelector('#localVideo').srcObject = local;
    };
  } catch (err) {
    console.error('Error sharing screen:', err);
  }
});

document.getElementById('endCallButton').addEventListener('click', () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (local) local.getTracks().forEach(track => track.stop());
  if (remote) remote.getTracks().forEach(track => track.stop());

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;

  alert('Call Ended');
});

window.addEventListener('beforeunload', () => socket.disconnect());

initialize();


