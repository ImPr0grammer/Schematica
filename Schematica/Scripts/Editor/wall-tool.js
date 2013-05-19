function WallTool(ctx) {

    var selectedPoint = null;
    var hoveredPoint = null;
    var selectedWall = null;
    var hoveredWall = null;
    
    this.keydown = function (event) {
        if (event.keyCode == 27) {
            if (selectedPoint)
                ctx.Graph.deletePointIfCan(selectedPoint);

            selectedPoint = null;
            selectedWall = null;
            redrawUp();
        }
        else if (event.keyCode == 46) {
            if (selectedPoint) {
                ctx.Graph.deletePoint(selectedPoint, ctx);
                redraw();
            }
            if (selectedWall) {
                ctx.Graph.deleteWall(selectedWall, ctx);
                redraw();
            }

            selectedPoint = null;
            selectedWall = null;
        }
        
    };

    this.click = function(point) {
        var pointIdx;
        selectedWall = null;

        if (selectedPoint == null) {
            pointIdx = ctx.Graph.findNearPoint(point);
            if (pointIdx < 0) {
                // Если ничего не выделено и не навелись на точку, но навелись на стену
                // То считаем, что выделили стену
                selectedWall = ctx.Graph.findNearWall(point);
                if (selectedWall) {
                    redrawUp();
                    return;
                }
            }
        }

        pointIdx = ctx.Graph.getPointIndex(point);

        if (selectedPoint != null) {
            ctx.Graph.addWall(selectedPoint, pointIdx, ctx);
        }
        selectedPoint = pointIdx;
        redrawUp();
    };

    function redraw() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        ctx.DownCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        ctx.Graph.draw(ctx);
    }

    this.mouseDown = function(point) {
        movingPoint = ctx.Graph.findNearPoint(point);
        if (movingPoint >= 0) {
            selectedWall = null;
            hoveredPoint = movingPoint;
        } else {
            movingPoint = null;
        }
    };

    var movingPoint = null;
    var moving = false;

    this.mouseUp = function(point) {
        if (moving && movingPoint) {
            ctx.Graph.movePoint(movingPoint, {x: Math.floor(point.x / 10) * 10, y: Math.floor(point.y / 10) * 10});
            redraw();
        }
        moving = false;
        movingPoint = null;
    };

    this.mouseMove = function(point) {
        if ((hoveredPoint != null && hoveredPoint >= 0) || hoveredWall) {
            ctx.UpCanvas.css('cursor', 'default');
            hoveredPoint = null;
            hoveredWall = null;
            redrawUp();
        }
        moving = true;

        if (movingPoint) {
            selectedPoint = null;
            selectedWall = null;
            ctx.Graph.movePoint(movingPoint, point);
            redraw();
            redrawUp();
        } else {
            hoveredPoint = ctx.Graph.findNearPoint(point);
            if (hoveredPoint >= 0) {
                ctx.UpCanvas.css('cursor', 'pointer');
                redrawUp();
                return;
            } else {
                hoveredPoint = null;
            }

            hoveredWall = ctx.Graph.findNearWall(point);
            if (hoveredWall) {
                ctx.UpCanvas.css('cursor', 'pointer');
                redrawUp();
                return;
            } else {
                hoveredWall = null;
            }
        }
    };
    
    function redrawUp() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        ctx.Graph.drawSelected({ Point: selectedPoint, Wall: selectedWall }, ctx);
        ctx.Graph.drawHovered({ Point: hoveredPoint, Wall: hoveredWall }, ctx);
    }

    this.deActivate = function() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        selectedPoint = null;
        hoveredPoint = null;
        selectedWall = null;
        hoveredWall = null;
    };

    this.activate = function() {
    };
}