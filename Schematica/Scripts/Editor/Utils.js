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
    for (var i = 0; i < state.Walls.length; ++i) {
        var wall = state.Walls[i];
        var wallLength = getWallLength(wall);
        var area = getArea(point, wall.From, wall.To);
        if (wallLength < 1e-3)
            continue;

        var dist = area / wallLength;
        if (dist < 10)
            return wall;
    }
    return null;
}

function getWallLength(wall) {
    var p = diff(wall.From, wall.To);
    return Math.sqrt(sqr(p.x) + sqr(p.y));
}

function getArea(point1, point2, point3) {
    var a = diff(point2, point1);
    var b = diff(point3, point1);

    return Math.abs(a.x * b.y - a.y * b.x);
}

function diff(point1, point2) {
    return { x: point2.x - point1.x, y: point2.y - point1.y };
}

function drawWall(wall, ctx, color) {
    color = color || 'gray';
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(wall.From.x, wall.From.y);
    ctx.lineTo(wall.To.x, wall.To.y);
    ctx.stroke();
}

function drawWallSelected(wall, ctx, color) {
    color = color || '#ADD8E6';
    ctx.lineWidth = 4;
    drawWall(wall, ctx, color);
    ctx.lineWidth = 1;
}

function drawWallHovered(wall, ctx) {
    drawWallSelected(wall, ctx, '#BEE3FA');
}

function unDrawWall(wall, ctx) {
    ctx.lineWidth = 4;
    drawWall(wall, ctx, '#eee');
    ctx.lineWidth = 1;
}

function drawSelected(point, ctx, color) {
    color = color || '#ADD8E6';
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawHovered(point, ctx) {
    drawSelected(point, ctx, '#BEE3FA');
}

function clearAll(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

function sqr(a) {
    return a * a;
}
