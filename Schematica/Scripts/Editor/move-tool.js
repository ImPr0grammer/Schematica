function MoveTool(ctx) {

    var _movedPoint = null;
    var _selectedWall = null;
    var _moving = false;
    var _nearSelection = false;

    this.deActivate = function () {
        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
    };

    this.activate = function () {
    };

    this.keydown = function (event) {
        if (event.keyCode == 46 && _selectedWall) {
            for (var i = 0; i < ctx.State.Walls.length; ++i) {
                var wall = ctx.State.Walls[i];
                if (isEqualPoints(wall.From, _selectedWall.From) && isEqualPoints(wall.To, _selectedWall.To)) {
                    ctx.State.Walls.splice(i, 1);
                    unDrawWall(wall, ctx.DownCtx);
                    _selectedWall = null;
                    clearUp();
                    return;
                }
            }
        }
    };

    this.click = function(point) {
        _selectedWall = findNearWall(point, ctx.State, 10);
        clearUp();
    };
    
    this.mouseDown = function (point) {
        _movedPoint = findNearPoint(point, ctx.State, 20);
        if (_movedPoint) {
            drawSelected(_movedPoint, ctx.UpCtx);
            _selectedWall = null;
        }
        clearUp();
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
            clearUp();
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
                drawHovered(nearPoint, ctx.UpCtx);
                ctx.UpCanvas.css('cursor', 'pointer');
                _nearSelection = true;
                return;
            }

            var nearWall = findNearWall(point, ctx.State, 10);
            if (nearWall) {
                drawWallHovered(nearWall, ctx.UpCtx);
                ctx.UpCanvas.css('cursor', 'pointer');
                _nearSelection = true;
            }
        }
    };
    
    function clearUp() {
        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
        if (_selectedWall) {
            drawWallSelected(_selectedWall, ctx.UpCtx);
        }
    }

    
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

        clearUp();
        if (!finished)
            drawSelected(point, ctx.UpCtx);
    }
}