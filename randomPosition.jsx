(function (thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Randomize XYZ Position", undefined, { resizeable: false });

        if (win !== null) {
            win.orientation = "column";
            win.alignChildren = ["fill", "top"];

            function createAxisGroup(axis, defaultMin, defaultMax) {
                var group = win.add("group");
                group.orientation = "row";
                var check = group.add("checkbox", undefined, axis.toUpperCase());
                var min = group.add("edittext", undefined, defaultMin);
                min.characters = 6;
                var max = group.add("edittext", undefined, defaultMax);
                max.characters = 6;
                return { check: check, min: min, max: max };
            }

            var xGroup = createAxisGroup("x", "0", "1000");
            var yGroup = createAxisGroup("y", "0", "1000");
            var zGroup = createAxisGroup("z", "-500", "500");

            var runBtn = win.add("button", undefined, "実行");
            runBtn.alignment = "center";

            runBtn.onClick = function () {
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

                // 値取得と検証
                function parseOrWarn(text, axis, type) {
                    var v = parseFloat(text.text);
                    if (isNaN(v)) {
                        alert(axis.toUpperCase() + " 軸の " + type + " 値が無効です。");
                        throw new Error("Invalid input");
                    }
                    return v;
                }

                try {
                    var settings = {
                        x: {
                            enabled: xGroup.check.value,
                            min: parseOrWarn(xGroup.min, "x", "最小"),
                            max: parseOrWarn(xGroup.max, "x", "最大")
                        },
                        y: {
                            enabled: yGroup.check.value,
                            min: parseOrWarn(yGroup.min, "y", "最小"),
                            max: parseOrWarn(yGroup.max, "y", "最大")
                        },
                        z: {
                            enabled: zGroup.check.value,
                            min: parseOrWarn(zGroup.min, "z", "最小"),
                            max: parseOrWarn(zGroup.max, "z", "最大")
                        }
                    };
                } catch (e) {
                    return; // 入力エラー時は中断
                }

                app.beginUndoGroup("ランダム位置");

                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    var is3D = layer.threeDLayer;
                    var pos = layer.property("Position").value;

                    var newX = settings.x.enabled ? random(settings.x.min, settings.x.max) : pos[0];
                    var newY = settings.y.enabled ? random(settings.y.min, settings.y.max) : pos[1];
                    var newZ = is3D && settings.z.enabled ? random(settings.z.min, settings.z.max) : pos[2];

                    if (is3D) {
                        layer.property("Position").setValue([newX, newY, newZ]);
                    } else {
                        layer.property("Position").setValue([newX, newY]);
                    }
                }

                app.endUndoGroup();
            };

            win.layout.layout(true);
        }

        return win;
    }

    function random(min, max) {
        return min + (max - min) * Math.random();
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);
