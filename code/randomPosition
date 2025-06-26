// 選択したレイヤーをランダムな位置に移動させるスクリプト
var selectedLayers = app.project.activeItem.selectedLayers;

app.beginUndoGroup("ランダム位置に移動");

for (var i = 0; i < selectedLayers.length; i++) {
    var layer = selectedLayers[i];
    var randomX = Math.random() * app.project.activeItem.width;
    var randomY = Math.random() * app.project.activeItem.height;
    layer.property("Position").setValue([randomX, randomY]);
}

app.endUndoGroup();
