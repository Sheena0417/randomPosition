// ランダム範囲を指定（必要に応じて調整）
var minX = -500, maxX = 500;
var minY = -300, maxY = 300;
var minZ = -200, maxZ = 200;

var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    app.beginUndoGroup("Randomize Position");

    for (var i = 1; i <= comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i - 1];

        // 3Dレイヤーになっていない場合は有効化
        if (!layer.threeDLayer) {
            layer.threeDLayer = true;
        }

        var randomPos = [
            random(minX, maxX),
            random(minY, maxY),
            random(minZ, maxZ)
        ];
        layer.property("Position").setValue(randomPos);
    }

    app.endUndoGroup();
}
