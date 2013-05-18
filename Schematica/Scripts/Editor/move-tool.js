function MoveTool(ctx) {

    var _movedPoint = null;
    var _selectedWallIndex = null;
    var _moving = false;
    var _nearSelection = false;

    this.click = function(point) {

    };
    
    this.mouseDown = function (point) {
        clearAll(ctx.UpCtx, ctx.width, ctx.height);
        _movedPoint = findNearPoint(point, ctx.State, 20);
        console.log('mouseDows', _movedPoint);
        if (_movedPoint)
            drawSelected(_movedPoint, ctx.UpCtx);
    };

    this.mouseUp = function (point) {
        if (_moving && _movedPoint) {
            movePoint(point, false);
        }
        
        _moving = false; 
        _movedPoint = null;
    };

    this.mouseMove = function (point) {
        if (_nearSelection) {
            clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
            ctx.UpCanvas.css('cursor', 'default');
            _nearSelection = false;
        }
        _moving = true;

        if (_movedPoint) {
            movePoint(point, true);
            _movedPoint = point;
        } else {
            var nearPoint = findNearPoint(point, ctx.State, 10);
            if (nearPoint) {
                drawSelected(nearPoint, ctx.UpCtx);
                _nearSelection = true;
                ctx.UpCanvas.css('cursor', 'pointer');
                return;
            }

            var nearWall = findNearWall(point, ctx.State, 10);
            if (nearWall) {
                drawWallSelected(nearWall, ctx.UpCtx);
                ctx.UpCanvas.css('cursor', 'pointer');
            }
        }
    };

    this.deActivate = function () {
        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
    };

    this.activate = function () {
    };
    
    function movePoint(point, finished) {
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
        }

        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
        if (!finished)
            drawSelected(point, ctx.UpCtx);
    }
}