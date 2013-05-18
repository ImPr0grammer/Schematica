function WallTool(ctx) {

    var radious = 10;
    var selectedPoint = null;

    function addWall(from, to) {
        if (!from)
            return;

        var wall = { From: from, To: to };
        ctx.State.Walls.push(wall);
        drawWall(wall, ctx.DownCtx);
    }
    
    this.click = function (point) {
        var foundPoint = findNearPoint(point, ctx.State, 2*radious);

        if (foundPoint) {
            if (selectedPoint) {
                addWall(selectedPoint, foundPoint);
            }
            selectedPoint = foundPoint;
        } else {
            addWall(selectedPoint, point);
            selectedPoint = point;
        }

        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
        drawSelected(selectedPoint, ctx.UpCtx);
    };

    this.mouseDown = function(event) {
     //   console.log('down: ' + event.x + ',' + event.y);
    };

    this.mouseUp = function(event) {
       // console.log('up: ' + event.x + ',' + event.y);
    };

    this.mouseMove = function(event) {
        //console.log('move: ' + event.x + ',' + event.y);
    };

    this.deActivate = function() {
        clearAll(ctx.UpCtx, ctx.Width, ctx.Height);
        selectedPoint = null;
    };

    this.activate = function() {
    };

}