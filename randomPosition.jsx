(function (thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Randomize Position", undefined, { resizeable: true });

        if (win !== null) {
            win.orientation = "column";
            win.alignChildren = ["center", "top"];
            win.spacing = 10;
            win.margins = 10;

            function createAxisGroup(axis, defaultMin, defaultMax) {
                var outerGroup = win.add("group");
                outerGroup.orientation = "row";
                outerGroup.alignChildren = ["center", "center"];
                outerGroup.alignment = "center";

                var check = outerGroup.add("checkbox", undefined, axis.toUpperCase());
                check.preferredSize.width = 50;

                var min = outerGroup.add("edittext", undefined, defaultMin);
                var max = outerGroup.add("edittext", undefined, defaultMax);

                min.characters = 4;
                max.characters = 4;

                min.onChanging = function () {
                    adjustEditWidth(min);
                };
                max.onChanging = function () {
                    adjustEditWidth(max);
                };

                adjustEditWidth(min);
                adjustEditWidth(max);

                return { group: outerGroup, check: check, min: min, max: max };
            }

            function adjustEditWidth(textbox) {
                var len = textbox.text.length;
                var width = Math.max(4, len) * 8 + 20; // 8px * 桁数 + padding
                textbox.preferredSize.width = width;
                textbox.parent.layout.layout(true);
            }

            var xGroup = createAxisGroup("x", "0", "1000");
            var yGroup = createAxisGroup("y", "0", "1000");
            var zGroup = createAxisGroup("z", "-500", "500");

            var compBtn = win.add("button", undefined, "Use Composition Size");
            compBtn.onClick = function () {
                var comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    alert("Please open a composition.");
                    return;
                }
                xGroup.min.text = "0";
                xGroup.max.text = comp.width.toString();
                yGroup.min.text = "0";
                yGroup.max.text = comp.height.toString();

                adjustEditWidth(xGroup.max);
                adjustEditWidth(yGroup.max);
            };

            var runBtn = win.add("button", undefined, "Run");
            runBtn.alignment = "center";
            runBtn.onClick = function () {
                run(xGroup, yGroup, zGroup);
            };

            win.layout.layout(true);
            win.onResizing = win.onResize = function () {
                this.layout.resize();
            };
        }

        return win;
    }

    function run(xGroup, yGroup, zGroup) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Please open a composition.");
            return;
        }

        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            alert("Please select at least one layer.");
            return;
        }

        function parseOrWarn(text, axis, type) {
            var v = parseFloat(text.text);
            if (isNaN(v)) {
                alert(axis.toUpperCase() + " " + type + " value is invalid.");
                throw new Error("Invalid input");
            }
            return v;
        }

        try {
            var settings = {
                x: {
                    enabled: xGroup.check.value,
                    min: parseOrWarn(xGroup.min, "x", "min"),
                    max: parseOrWarn(xGroup.max, "x", "max")
                },
                y: {
                    enabled: yGroup.check.value,
                    min: parseOrWarn(yGroup.min, "y", "min"),
                    max: parseOrWarn(yGroup.max, "y", "max")
                },
                z: {
                    enabled: zGroup.check.value,
                    min: parseOrWarn(zGroup.min, "z", "min"),
                    max: parseOrWarn(zGroup.max, "z", "max")
                }
            };
        } catch (e) {
            return;
        }

        app.beginUndoGroup("Randomize Position");

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
