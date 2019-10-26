navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

var localVideo = document.getElementById('local_video');
var playbackVideo = document.getElementById('playback_video');
var anker = document.getElementById('downloadlink');
var localStream = null;
var recorder = null;
var blobUrl = null;


function startRecording() {
    if (!localStream) {
        console.warn("no stream");
        return;
    }
    if (recorder) {
        console.warn("recorder already exist");
        return;
    }

    recorder = new MediaRecorder(localStream);
    recorder.ondataavailable = function (evt) {
        console.log("data available, start playback");
        var videoBlob = new Blob([evt.data], { type: evt.data.type });
        blobUrl = window.URL.createObjectURL(videoBlob);
        playbackVideo.src = blobUrl;
        playbackVideo.onended = function () {
            playbackVideo.pause();
            playbackVideo.src = "";
        };

        anker.download = 'recorded.webm';
        anker.href = blobUrl;

        playbackVideo.play();
    }

    recorder.start();
    console.log("start recording");
}

function stopRecording() {
    if (recorder) {
        recorder.stop();
        console.log("stop recording");
    }
}

function playRecorded() {
    if (blobUrl) {
        playbackVideo.src = blobUrl;
        playbackVideo.onended = function () {
            playbackVideo.pause();
            playbackVideo.src = "";
        };

        playbackVideo.play();
    }
}

// Request the usermedia
function startVideo() {
    navigator.getUserMedia({ video: true, audio: true }, showMedia, errCallback);
}

function showMedia(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
}

var errCallback = function (e) {
    console.log('media error', e);
};


function stopVideo() {
    if (localStream) {
        localVideo.pause();
        localVideo.src = "";

        localStream.stop();
        localStream = null;
    }
}