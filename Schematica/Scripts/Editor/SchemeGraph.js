﻿SchemeGraph = function() {
    var points = [];
    var graph = {};

    var radious = 10;
    var freeIndexes = [];

    /* --------- Добавление и удаление точек и стен -------------*/

    this.addWall = function(fromIdx, toIdx, ctx) {

        function addToGraph(fromIndex, toIndex) {
            var row = graph[fromIndex];
            if (!row) {
                row = {};
                graph[fromIndex] = row;
            }

            row[toIndex] = 1;

            points[fromIndex].used++;
        }

        // Не добавляем стену дважны
        var disjoint = graph[toIdx];
        if (disjoint && disjoint[fromIdx] == 1)
            return { From: fromIdx, To: toIdx };

        // граф не ориентированный
        addToGraph(fromIdx, toIdx);
        addToGraph(toIdx, fromIdx);

        if (ctx) {
            drawWall(fromIdx, toIdx, ctx.DownCtx);
        }
        return { From: fromIdx, To: toIdx };
    };

    this.deleteWall = function(wall, ctx) {
        doDeleteWall(wall, ctx);
    };

    function doDeleteWall(wall, ctx) {
        var nearRooms = doFilterRooms(ctx.Rooms, wall);
        if (nearRooms.length > 0) {
            var deleted = '';
            for (var i = 0; i < nearRooms.length; ++i) {
                if (i > 0)
                    deleted += ', ';
                deleted = deleted + '"' + nearRooms[i].Name + '"';
            }

            if (!confirm('Внимание будут удалены комнаты:' + deleted + ', продолжить?'))
                return;
        }

        for (i = 0; i < nearRooms.length; ++i) {
            var room = nearRooms[i];
            delete ctx.Rooms[room.Id];
        }

        var fromIdx = wall.From;
        var toIdx = wall.To;

        function deleteFromGraph(fromIndex, toIndex) {
            var row = graph[fromIndex];
            delete row[toIndex];
            points[fromIndex].used--;
            doDeletePointIfCan(fromIndex);
        }

        deleteFromGraph(fromIdx, toIdx);
        deleteFromGraph(toIdx, fromIdx);
    }

    this.deletePoint = function(pointIdx, ctx) {
        var disjoint = graph[pointIdx];
        if (disjoint) {
            var toDelete = [];
            for (var toIdx in disjoint) {
                if (disjoint.hasOwnProperty(toIdx)) {
                    toDelete.push(toIdx);
                }
            }

            for (var i = 0; i < toDelete.length; ++i) {
                doDeleteWall({ From: pointIdx, To: toDelete[i] }, ctx);
            }
        }

        doDeletePointIfCan(pointIdx);
    };

    function doDeletePointIfCan(pointIdx) {
        var point = points[pointIdx];
        if (point == null)
            return;

        if (points[pointIdx].used == 0) {
            points[pointIdx] = null;
            freeIndexes.push(pointIdx);
        }
    }

    this.deletePointIfCan = function(pointIdx) {
        doDeletePointIfCan(pointIdx);
    };

    this.getPoints = function(pointIndex) {
        var row = graph[pointIndex];
        var result = [];
        if (!row)
            return result;

        for (var k in row) {
            if (row.hasOwnProperty(k)) {
                var value = row[k];
                result.push(value);
            }
        }
        return result;
    };

    this.getPointIndex = function(point) {
        return doGetPointIndex(point);
    };

    function doGetPointIndex(point) {
        // ищем
        for (var i = 0; i < points.length; ++i) {
            if (!points[i])
                continue;

            if (isNear(points[i], point, 2 * radious))
                return i;
        }
        // добавляем
        // Переиспользуем индекс
        if (freeIndexes.length > 0) {
            var index = freeIndexes[freeIndexes.length - 1];
            freeIndexes.pop();
            points[index] = { x: point.x, y: point.y, used: 0 };
            return index;
        }

        // Новый индекс
        var idx = points.length;
        points.push({ x: Math.round(point.x / 10) * 10, y: Math.round(point.y / 10) * 10, used: 0 });
        return idx;
    }

    ;

    this.findNearPoint = function(point) {
        for (var i = 0; i < points.length; ++i) {
            var forTest = points[i];
            if (!forTest)
                continue;

            if (isNear(point, forTest, 20)) {
                return i;
            }
        }

        return -1;
    };

    this.getPointFromIndex = function(idx) {
        return points[idx];
    };

    this.movePoint = function(idx, point) {
        points[idx].x = point.x;
        points[idx].y = point.y;
    };

    this.findNearWall = function(point) {
        for (var i = 0; i < points.length; ++i) {
            var fromPoint = points[i];
            if (!fromPoint)
                continue;

            var disjoint = graph[i];
            if (!disjoint)
                continue;

            for (var toIdx in disjoint) {
                if (!disjoint.hasOwnProperty(toIdx))
                    continue;

                var wall = { From: i, To: parseInt(toIdx) };
                var wallLength = getWallLength(wall);

                var area = getArea(point, points[wall.From], points[wall.To]);
                if (wallLength < 1e-3)
                    continue;

                var dist = area / wallLength;
                if (dist > radious * 2)
                    continue;

                // ЧТобы не выделять за пределами прямой
                if (point.x > Math.max(points[wall.From].x, points[wall.To].x) + radious)
                    continue;

                if (point.x < Math.min(points[wall.From].x, points[wall.To].x) - radious)
                    continue;

                if (point.y > Math.max(points[wall.From].y, points[wall.To].y) + radious)
                    continue;

                if (point.y < Math.min(points[wall.From].y, points[wall.To].y) - radious)
                    continue;

                return wall;
            }
        }
        return null;
    };

    function getWallLength(wall) {
        var p = diff(points[wall.From], points[wall.To]);
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

    function sqr(a) {
        return a * a;
    }

    function isNear(point1, point2, radious) {
        return sqr(point1.x - point2.x) + sqr(point1.y - point2.y) <= sqr(radious);
    }

    /* ---------- Drawing ----------------- */

    this.draw = function(ctx) {
        ctx.DownCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);

        for (var i = 0; i < points.length; ++i) {
            var fromIdx = i;
            var point = points[i];
            if (!point) {
                continue;
            }

            var disjoint = graph[i];
            if (!disjoint)
                continue;

            for (var toIdx in disjoint) {
                if (!disjoint.hasOwnProperty(toIdx))
                    continue;

                if (fromIdx >= toIdx)
                    continue;

                drawWall(fromIdx, toIdx, ctx.DownCtx);
            }
        }
    };

    this.drawSelected = function(selected, ctx) {
        if (!selected)
            return;

        if (selected.Point != undefined && selected.Point != null) {
            drawPointSelected(selected.Point, ctx.UpCtx);
        }

        if (selected.Wall) {
            drawWallSelected(selected.Wall, ctx.UpCtx);
        }
    };

    this.drawHovered = function(hovered, ctx) {
        if (!hovered)
            return;

        if (hovered.Point != undefined && hovered.Point != null) {
            drawPointSelected(hovered.Point, ctx.UpCtx, '#BEE3FA');
        }

        if (hovered.Wall) {
            drawWallSelected(hovered.Wall, ctx.UpCtx, '#BEE3FA');
        }
    };

    function drawPointSelected(point, ctx, color) {
        color = color || '#ADD8E6';
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.arc(points[point].x, points[point].y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    function drawWallSelected(wall, ctx, color) {
        color = color || '#ADD8E6';
        ctx.lineWidth = 4;
        drawWall(wall.From, wall.To, ctx, color);
        ctx.lineWidth = 1;
    }

    function drawWall(from, to, ctx, color) {
        color = color || 'yellow';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(points[from].x, points[from].y);
        ctx.lineTo(points[to].x, points[to].y);
        ctx.stroke();
    }


    /* ---------------- Поиск замкнутого контура ------------------*/

    this.findContour = function(point) {
        for (var i = 0; i < points.length; ++i) {
            var startPoint = points[i];
            if (!startPoint)
                continue;

            var calculator = new ContourCalculator();
            var contour = generateContours(point, i, calculator);
            if (contour)
                return contour;
        }

        function generateContours(lastPoint, curPointIdx, holder) {
            var disjoint = graph[curPointIdx];
            if (!disjoint)
                return null;

            // Нашли цикл
            if (holder.isVisited(curPointIdx)) {
                var contourIds = holder.getContour(curPointIdx);
                var isIn = isInContour(contourIds, point);
                if (isIn)
                    return contourIds;
                return false;
            }
            holder.addPoint(curPointIdx);

            // Находим точку с максимальным уголом
            var next = [];
            for (var toIdx in disjoint) {
                if (!disjoint.hasOwnProperty(toIdx))
                    continue;

                if (!graph[curPointIdx][toIdx])
                    continue;

                var angle = getAngle(lastPoint, points[curPointIdx], points[toIdx]);
                if (angle != null) {
                    next.push({ Idx: toIdx, Angle: angle });
                }
            }

            next.sort(function(a, b) {
                if (a.Angle < b.Angle)
                    return 1;
                else if (a.Angle > b.Angle)
                    return -1;
                return 0;
            });

            for (var j = 0; j < next.length; ++j) {
                var nextIdx = next[j].Idx;

                graph[curPointIdx][nextIdx] = 0;
                graph[nextIdx][curPointIdx] = 0;
                var result = generateContours(points[curPointIdx], nextIdx, holder);
                graph[curPointIdx][nextIdx] = 1;
                graph[nextIdx][curPointIdx] = 1;

                if (result != null)
                    return result;
            }

            return false;
        }
    };

    function isInContour(pointIdxes, testPoint) {

        var count = 0;
        for (var i = 0; i < pointIdxes.length; ++i) {
            var idx = pointIdxes[i];
            var nextIdx = pointIdxes[(i + 1) % pointIdxes.length];
            var point = points[idx];
            var nextPoint = points[nextIdx];
            var from = getDiff(point, testPoint);
            var to = getDiff(nextPoint, testPoint);

            if (Math.abs(from.x - to.x) < 1e-10) {
                if (Math.max(from.y, to.y) >= 0) {
                    count++;
                }
                continue;
            }

            var zeroY = (from.y * (to.x - from.x) + from.x * (from.y - to.y)) / (to.x - from.x);

            if (zeroY < -1e-10)
                continue;

            if (Math.max(from.x, to.x) < -1e-10)
                continue;

            if (Math.min(from.x, to.x) > 1e-10)
                continue;
            count++;
        }

        var result = count % 2 == 1;
        return result;
    }

    function ContourCalculator() {
        var stack = [];
        var visited = {};

        this.isVisited = function(idx) {
            return visited[idx];
        };

        this.addPoint = function(idx) {
            stack.push(idx);
            visited[idx] = 1;
        };

        this.getContour = function(idx) {
            var result = [];
            for (var i = stack.length - 1; i >= 0; --i) {
                result.push(stack[i]);
                if (stack[i] == idx)
                    return result;
            }
            return null;
        };
    }

    this.highlightContour = function(contour, ctx, color) {
        color = color || 'rgba(214,238,253, 0.5)';
        ctx.UpCtx.beginPath();
        ctx.UpCtx.moveTo(points[0].x, points[0].y);
        ctx.UpCtx.strokeStyle = color;
        
        for (var i = 0; i <= contour.length; ++i) {
            var to = contour[(i + 1) % contour.length];

            ctx.UpCtx.lineTo(points[to].x, points[to].y);
            ctx.UpCtx.stroke();
        }
        
        ctx.UpCtx.fillStyle = color;
        ctx.UpCtx.fill();
    };

    this.filterRooms = function (rooms, wall) {
        return doFilterRooms(rooms, wall);
    };

    function doFilterRooms(rooms, wall) {
        var result = [];
        for (var k in rooms) {
            if (!rooms.hasOwnProperty(k))
                continue;

            var room = rooms[k];
            for (var j = 0; j <= room.Contour.length; ++j) {
                var curIdx = room.Contour[j % room.Contour.length];
                var nextIdx = room.Contour[(j + 1) % room.Contour.length];

                if ((curIdx == parseInt(wall.From) && nextIdx == parseInt(wall.To))
                    || (curIdx == parseInt(wall.To) && nextIdx == parseInt(wall.From))) {
                    result.push(room);
                }
            }

        }
        return result;
    }
};