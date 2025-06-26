(function (thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Random Z Position", undefined, { resizeable: false });

        if (win !== null) {
            win.orientation = "column";
            win.alignChildren = ["fill", "top"];

            // === Z範囲入力 ===
            var zGroup = win.add("group");
            zGroup.orientation = "row";
            zGroup.add("statictext", undefined, "Min Z:");
            var minZ = zGroup.add("edittext", undefined, "-500");
            minZ.characters = 6;
            zGroup.add("statictext", undefined, "Max Z:");
            var maxZ = zGroup.add("edittext", undefined, "500");
            maxZ.characters = 6;

            // === 実行ボタン ===
            var runBtn = win.add("button", undefined, "実行");
            runBtn.alignment = "center";

            runBtn.onClick = function () {
                var min = parseFloat(minZ.text);
                var max = parseFloat(maxZ.text);

                if (isNaN(min) || isNaN(max)) {
                    alert("数値を正しく入力してください。");
                    return;
                }

                var comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    alert("コンポジションを開いてください。");
                    return;
                }

                var layers = comp.selectedLayers;
                if (layers.length === 0) {
                    alert("レイヤーを選択してください。");
                    return;
                }

                app.beginUndoGroup("Random Z Position");

                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    var pos = layer.property("Position").value;
                    if (!layer.threeDLayer) {
                        layer.threeDLayer = true;
                    }
                    var randZ = Math.random() * (max - min) + min;
                    layer.property("Position").setValue([pos[0], pos[1], randZ]);
                }

                app.endUndoGroup();
            };

            win.layout.layout(true);
        }

        return win;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);
