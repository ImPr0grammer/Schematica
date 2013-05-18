function MoveTool(ctx) {

    var _movedPoint = null;
    var _selectedWallIndex = null;
    var _moved = false;

    this.click = function(point) {

    };
    
    this.mouseDown = function (point) {
        clearAll(ctx.UpCtx, ctx.width, ctx.height);
        _movedPoint = findNearPoint(point, ctx.State, 20);
        if (_movedPoint)
            drawSelected(_movedPoint, ctx.UpCtx);
    };

    this.mouseUp = function (point) {
        if (_moved && _movedPoint) {
            movePoint(point, false);
        }
        
        _moved = false; 
        _movedPoint = null;
        // console.log('up: ' + event.x + ',' + event.y);
    };

    this.mouseMove = function (point) {
        _moved = true;

        if (_movedPoint) {
            movePoint(point, true);
        }
        //console.log('move: ' + event.x + ',' + event.y);
    };

    this.deActivate = function () {
        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
    };

    this.activate = function () {
    };
    
    function movePoint(point, drawSelectedPoint) {
        var walls = findWalls(_movedPoint, ctx.State);
        for (var i = 0; i < walls.length; ++i) {
            var wall = walls[i];
            unDrawWall(wall, ctx.DownCtx);

            if (isEqualPoints(wall.From, _movedPoint)) {
                wall.From = point;
            } else {
                wall.To = point;
            }

            drawWall(wall, ctx.DownCtx);
            
            clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
            if (drawSelectedPoint)
                drawSelected(point, ctx.UpCtx);
        }
    }
}