SchemeGraph = function () {
    var points = [];
    var graph = {};

    var radious = 10;

    var freeIndexes = [];

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

        // граф не ориентированный
        addToGraph(fromIdx, toIdx);
        addToGraph(toIdx, fromIdx);

        if (ctx) {
            drawWall(fromIdx, toIdx, ctx.DownCtx);
        }
        return { From: fromIdx, To: toIdx };
    };

    this.deleteWall = function(wall) {
        doDeleteWall(wall);
    };
    
    function doDeleteWall(wall) {
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

    this.deletePoint = function(pointIdx) {
        var disjoint = graph[pointIdx];
        if (disjoint) {
            var toDelete = [];
            for (var toIdx in disjoint) {
                if (disjoint.hasOwnProperty(toIdx)) {
                    toDelete.push(toIdx);
                }
            }
            
            for (var i = 0; i < toDelete.length; ++i) {
                doDeleteWall({ From: pointIdx, To: toDelete[i] });
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

            if (isNear(points[i], point, 2*radious))
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
        points.push({ x: point.x, y: point.y, used: 0 });
        return idx;
    };

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

                var wall = { From: i, To: toIdx };
                var wallLength = getWallLength(wall);
                
                var area = getArea(point, points[wall.From], points[wall.To]);
                if (wallLength < 1e-3)
                    continue;

                var dist = area / wallLength;
                if (dist < radious * 2)
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

    this.draw = function (ctx) {
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

    this.drawSelected = function (selected, ctx) {
        if (!selected)
            return;

        if (selected.Point != undefined && selected.Point != null) {
            drawPointSelected(selected.Point, ctx.UpCtx);
        }

        if (selected.Wall) {
            drawWallSelected(selected.Wall, ctx.UpCtx);
        }
    };

    this.drawHovered = function (hovered, ctx) {
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
        color = color || 'gray';
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(points[from].x, points[from].y);
        ctx.lineTo(points[to].x, points[to].y);
        ctx.stroke();
    }

}