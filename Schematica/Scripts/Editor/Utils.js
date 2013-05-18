function findNearPoint(point, state, radious) {
    for (var i = 0; i < state.Walls.length; ++i) {
        var from = state.Walls[i].From;
        var to = state.Walls[i].To;
        if (isNear(from, point, radious)) {
            return from;
        }

        if (isNear(to, point, radious)) {
            return to;
        }
    }

    return null;
}

function isNear(point1, point2, radious) {
    return sqr(point1.x - point2.x) + sqr(point1.y - point2.y) <= sqr(radious);

    function sqr(a) {
        return a * a;
    }
}

function isEqualPoints(point1, point2) {
    return isNear(point1, point2, 5);
}

function findWalls(point, state) {
    var result = [];
    for (var i = 0; i < state.Walls.length; ++i) {
        var wall = state.Walls[i];
        if (isEqualPoints(wall.From, point) || isEqualPoints(wall.To, point)) {
            result.push(wall);
        }
    }
    return result;
}

function findNearWall(point, state) {
    for (var i = 0; i < state.findWalls.length; ++i) {
        var wall = state.Walls[i];
        
    }
}

function drawWall(wall, ctx, color) {
    color = color || 'gray';
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(wall.From.x, wall.From.y);
    ctx.lineTo(wall.To.x, wall.To.y);
    ctx.stroke();
}

function unDrawWall(wall, ctx) {
    ctx.lineWidth = 4;
    drawWall(wall, ctx, '#eee');
    ctx.lineWidth = 1;
}


function clearAll(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

function drawSelected(point, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = '#ADD8E6';
    ctx.fillStyle = '#ADD8E6';
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}


