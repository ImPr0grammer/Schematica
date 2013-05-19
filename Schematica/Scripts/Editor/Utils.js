

// Угол можеду (point1, point2) и (point2, point3)
function getAngle(point1, point2, point3) {
    if (pointEquals(point1, point2) || pointEquals(point2, point3)) {
        return null;
    }

    var w12 = getDiff(point2, point1);
    var w23 = getDiff(point3, point2);
    var len12 = len(w12);
    var len23 = len(w23);

    var cos = scalarMul(w12, w23) / (len12 * len23);
    var sin = vectMul(w12, w23) / (len12 * len23);

    var result = Math.atan2(sin, cos);
    return result;
}

function vectMul(a, b) {
    return a.x * b.y - a.y * b.x;
}

function scalarMul(a, b) {
    return a.x * b.x + a.y * b.y;
}

function getDiff(point1, point2) {
    return { x: point2.x - point1.x, y: point2.y - point1.y };
}

function pointEquals(point1, point2) {
    return (Math.abs(point2.x - point1.x) <= 1e-10)
        && (Math.abs(point2.y - point1.y) <= 1e-10);
}

function len(point) {
    return Math.sqrt(sqr(point.y) + sqr(point.x));
}

function sqr(a) {
    return a * a;
}