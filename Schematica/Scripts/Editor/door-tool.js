function DoorTool(ctx) {
    this.activate = function() {

    };

    this.deActivate = function() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
    };

    this.click = function(point) {
        selectedWall = ctx.Graph.findNearWall(point);
        if (selectedWall) {
            var rooms = ctx.Graph.filterRooms(ctx.Rooms, selectedWall);
            if (rooms.length < 2) {
                selectedWall = null;
            } else {
                createDoor(selectedWall);
                hoveredWall = null;
            }
        }

        redrawUp();
    };
    
    function createDoor(wall, rooms, point) {
        var door = { Wall: wall, Point: point };
        ctx.Doors.push(door);
    }

    var hoveredWall = null;
    var selectedWall = null;
    this.mouseMove = function(point) {
        if (hoveredWall) {
            hoveredWall = null;
            ctx.UpCanvas.css('cursor', 'default');
        }

        hoveredWall = ctx.Graph.findNearWall(point);
        if (hoveredWall) {

            var rooms = ctx.Graph.filterRooms(ctx.Rooms, hoveredWall);
            if (!rooms || rooms.length < 2)
                hoveredWall = null;
        }

        if (hoveredWall) {
            ctx.UpCanvas.css('cursor', 'pointer');
        }

        redrawUp();
    };
    
    function redrawUp() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        ctx.Graph.drawSelected({ Wall: selectedWall }, ctx);
        ctx.Graph.drawHovered({ Wall: hoveredWall }, ctx);
    }
}