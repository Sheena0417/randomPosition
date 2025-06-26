function random(min, max) {
    return min + (max - min) * Math.random();
}

function showRandomPositionUI() {
    var win = new Window("palette", "ランダム位置設定", undefined);
    win.orientation = "column";
    win.alignChildren = "left";

    win.add("statictext", undefined, "Z軸 最小値:");
    var minZInput = win.add("edittext", undefined, "-500");
    minZInput.characters = 10;

    win.add("statictext", undefined, "Z軸 最大値:");
    var maxZInput = win.add("edittext", undefined, "500");
    maxZInput.characters = 10;

    var execBtn = win.add("button", undefined, "実行");

    execBtn.onClick = function () {
        var minZ = parseFloat(minZInput.text);
        var maxZ = parseFloat(maxZInput.text);
        if (isNaN(minZ) || isNaN(maxZ)) {
            alert("数値を正しく入力してください。");
            return;
        }

        applyRandomPosition(minZ, maxZ);
    };

    win.center();
    win.show();
}

function applyRandomPosition(minZ, maxZ) {
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
        var selectedLayers = comp.selectedLayers;
        var compWidth = comp.width;
        var compHeight = comp.height;

        app.beginUndoGroup("Randomize Position with UI");

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var x = random(0, compWidth);
            var y = random(0, compHeight);

            if (layer.threeDLayer) {
                var z = random(minZ, maxZ);
                layer.property("Position").setValue([x, y, z]);
            } else {
                layer.property("Position").setValue([x, y]);
            }
        }

        app.endUndoGroup();
    } else {
        alert("コンポジションが選択されていません。");
    }
}

// スクリプト実行時にUIを表示
showRandomPositionUI();
