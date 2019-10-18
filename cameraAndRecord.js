var ctx;
var frames;
var recorder;

//videoタグを取得
var video = document.getElementById("video");
//取得するメディア情報を指定
var medias = { audio: false, video: {} };
medias.video.facingMode = { exact: "user" };
//medias.video.facingMode = { exact: "environment" };
document.getElementById("str").textContent = "user";

//getUserMediaを用いて、webカメラの映像を取得
navigator.mediaDevices.getUserMedia(medias).then(
    function (stream) {
        //videoタグのソースにwebカメラの映像を指定
        video.srcObject = stream;
        
    }
).catch(
    function (err) {
        //カメラの許可がされなかった場合にエラー
        window.alert("not allowed to use camera");
    }
);  

var canvas = document.getElementById("canvas");
//ビデオのメタデータが読み込まれるまで待つ
video.addEventListener("loadedmetadata", function (e) {
    //canvasにカメラの映像のサイズを設定
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    //getContextで描画先を取得
    var ctx = canvas.getContext("2d");
    //毎フレームの実行処理
    setInterval(function (e) {
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imagedata.data;
        var allPicColor = 0;
        for (var i = 0; i < canvas.height; i++) {
            for (var j = 0; j < canvas.width; j++) {
                var index = (i * canvas.width + j) * 4;
                //元のピクセルカラーを取得
                var r = data[index + 0];
                var g = data[index + 1];
                var b = data[index + 2];

                //RGBをグレースケールに変換
                var color = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
                data[index + 0] = color;
                data[index + 1] = color;
                data[index + 2] = color;
                allPicColor += color;
            }
        }
        var val = allPicColor / (canvas.height * canvas.width);
        document.getElementById("debug").textContent = val;
        if (val > 50) document.getElementById("debug_bool").textContent = "false";
        else document.getElementById("debug_bool").textContent = "true";
        ctx.putImageData(imagedata, 0, 0, 0, 0, canvas.width, canvas.height);
    }, 33);  
});  
function frame_start() {
    //canvasの取得
    canvas = document.getElementById('preview');
    ctx = canvas.getContext('2d');
    //canvasからストリームを取得
    var stream = canvas.captureStream();
    //ストリームからMediaRecorderを生成
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    //ダウンロード用のリンクを準備
    var anchor = document.getElementById('downloadlink');
    //録画終了時に動画ファイルのダウンロードリンクを生成する処理
    recorder.ondataavailable = function (e) {
        var videoBlob = new Blob([e.data], { type: e.data.type });
        blobUrl = window.URL.createObjectURL(videoBlob);
        anchor.download = 'movie.webm';
        anchor.href = blobUrl;
        anchor.style.display = 'block';
    }
    //録画開始
    recorder.start();
    //フレーム描画開始
    frames = document.getElementsByClassName('anime')[0].getElementsByTagName('img');
    viewFrame();
}

function frame_end() {
    recorder.stop();
}

