function random(min, max) {
    return min + (max - min) * Math.random();
}

var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    var selectedLayers = comp.selectedLayers;
    var compWidth = comp.width;
    var compHeight = comp.height;

    app.beginUndoGroup("Randomize X and Y");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        // 元のPosition値を取得
        var pos = layer.property("Position").value;

        // 新しいx, yをコンポサイズに合わせて生成
        var x = random(0, compWidth);
        var y = random(0, compHeight);

        // 3Dレイヤーならzを保持、2Dレイヤーなら2次元でセット
        if (layer.threeDLayer) {
            var z = pos[2]; // zを保持
            layer.property("Position").setValue([x, y, z]);
        } else {
            layer.property("Position").setValue([x, y]);
        }
    }

    app.endUndoGroup();
}
