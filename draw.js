const drawCan = document.getElementById('drawingCanvas');
const drawCtx = drawCan.getContext('2d');

let pencilColor = "";
const pallet = document.getElementById("textColorPicker");

pallet.addEventListener("change", (e) => {
    console.log("わんだほーい！！！");
    pencilColor = e.target.value;
});

// キャンバスサイズを設定する関数
function setCanvasSize() {
    // ウィンドウの幅と高さを取得
    const rect = drawCan.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1; // devicePixelRatioがない場合は1を使用

    // キャンバスの実際のサイズを設定
    drawCan.width = rect.width * scale;
    drawCan.height = rect.height * scale;

    // 描画コンテキストのスケールを設定
    drawCtx.scale(scale, scale);
}

// ページが読み込まれたときとウィンドウサイズが変更されたときにキャンバスサイズを設定
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let mouse = { x: 0, y: 0 };
let drawing = false;

// マウスの位置を追跡、キャンバスのスケーリングを反映した補正を行う
function updateMousePosition(e) {
    const rect = drawCan.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (drawCan.width / rect.width);   // X座標のスケール補正
    mouse.y = (e.clientY - rect.top) * (drawCan.height / rect.height);  // Y座標のスケール補正
}

// タッチ
drawCan.addEventListener("touchstart", (e) => {
    e.preventDefault();
    drawing = true;
    const touch = e.touches[0];
    updateMousePosition(touch);
    drawCtx.beginPath();
    drawCtx.moveTo(mouse.x, mouse.y);
}, false);

drawCan.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    updateMousePosition(touch);
    if (drawing) {
        onPaint();
    }
}, false);

drawCan.addEventListener("touchend", () => {
    drawing = false;
}, false);

// マウス
drawCan.addEventListener("mousedown", (e) => {
    drawing = true;
    updateMousePosition(e);
    drawCtx.beginPath();
    drawCtx.moveTo(mouse.x, mouse.y);
    console.log("ワンだほーい");
    drawCan.style.cursor = 'pointer';
});

drawCan.addEventListener("mousemove", (e) => {
    updateMousePosition(e);
    if (drawing) {
        onPaint();
    }
});

drawCan.addEventListener("mouseup", () => {
    drawing = false;
});

// 描画処理
const onPaint = function () {
    if (drawing) {
        drawCtx.lineTo(mouse.x, mouse.y);
        drawCtx.strokeStyle = pencilColor;  // 線の色
        drawCtx.lineWidth = 3;  // 線の太さ
        drawCtx.stroke();
    }
};

// クリア機能の追加（オプション）
function clearCanvas() {
    drawCtx.clearRect(0, 0, drawCan.width, drawCan.height);
    drawCtx.fillStyle = "blue";  // 背景色を再設定
    drawCtx.fillRect(0, 0, drawCan.width, drawCan.height);
}

// 保存機能
const saveBtn = document.getElementById('drawSaveButton');

saveBtn.addEventListener('click', () => {
    const imgName = "ooo";
    const imageType = `image/png`;
    const imgData = drawCan.toDataURL(imageType);
    const byteString = atob(imgData.split(',')[1]);
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);  // Blob URLを作成

    // ダウンロード用のリンクを作成
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${imgName}.png`;

    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        window.open(imgData, '_blank');
    } else {
        downloadLink.click();  // PCでは自動的にダウンロード
    }

    // メモリリークを防ぐためにURLを解放
    URL.revokeObjectURL(url);
});
