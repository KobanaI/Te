const canvas = document.getElementById("myCanvas");
const bgColorPicker = document.getElementById("bgColorPicker")
bgColorPicker.addEventListener("change", (event) => {
  console.log("選択された色: " + event.target.value);  // 色をログに出力
  ctxSetBack(event.target.value);
  updateFinalImg();
});

canvas.width = 200;  // ピクセルサイズで指定
canvas.height = 200;
const ctx = canvas.getContext("2d");

function drawTextCentered(text) {
  // フォントサイズの初期値
  let fontSize = 100;
  ctx.font = `${fontSize}px Arial`;

  // テキストの幅と高さを計算
  let textWidth = ctx.measureText(text).width;
  let textHeight = fontSize; // フォントサイズを高さとして使用

  // キャンバスのサイズに合わせてフォントサイズを調整
  while (textWidth > canvas.width || textHeight > canvas.height) {
      fontSize -= 1; // フォントサイズを小さくする
      ctx.font = `${fontSize}px Arial`;
      textWidth = ctx.measureText(text).width;
      textHeight = fontSize;
  }

  // テキストを中央に配置
  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + textHeight / 2) / 2; // ベースラインを中央に合わせる

  ctx.fillStyle = "white"; // 文字の色
  ctx.fillText(text, x, y);
}
drawTextCentered("ハロー")


const imageType = `image/png`;
const imgName = `temp`

//画像の完成イメージの部分
let imgData = canvas.toDataURL(imageType); 
const imgElement = document.getElementById("finalImg");
imgElement.src = imgData;
imgElement.width = 200;

const geneButton = document.getElementById("gButton");

function ctxSetBack(color){
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  ctxSetText();

}

function ctxSetText(){
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Hello, World!", 50, 100);
}

function updateFinalImg(){
  imgData = canvas.toDataURL(imageType); 
  imgElement.src = imgData;
}


geneButton.addEventListener("click", ()=>{




  const imgData = canvas.toDataURL(imageType); // Canvasから画像データを取得
  const byteString = atob(imgData.split(',')[1]); // Base64をデコード
  const arrayBuffer = new Uint8Array(byteString.length);
  
  
  // バイナリデータの長さを取得
  for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob); // Blob URLを作成
  
  // ダウンロード用のリンクを作成
  const downloadLink = document.createElement("a");
  downloadLink.href = url;  // Blob URLをhrefに設定
  downloadLink.download = `${imgName}.png`;  // ダウンロード時のファイル名
  downloadLink.click();  // ダウンロードをトリガー

  
  console.log(url);
  // メモリリークを防ぐためにURLを解放
  URL.revokeObjectURL(url);
});





//Firebase + Reactで作る
