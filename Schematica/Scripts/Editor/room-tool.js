function RoomTool(ctx) {

    this.activate = function() {

    };

    this.deActivate = function() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.height);
    };

    var hoverContourKey = null;
    this.mouseMove = function (point) {
        var contour = ctx.Graph.findContour(point);
        if (contour) {
            var newKey = getContourKey(contour);
            if (newKey != hoverContourKey) {
                ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
                ctx.Graph.highlightContour(contour, ctx);
            }
        } else {
            hoverContourKey = null;
            ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        }
    };

    this.click = function(point) {
        var contour = ctx.Graph.findContour(point);
        if (contour) {
            ctx.Graph.highlightContour(contour, ctx);
            var contourKey = getContourKey(contour);
            var room = ctx.Rooms[contourKey];

            var action = room ? 'Редактирование' : 'Создание';

            var content = $('<div style="margin:0px 20px">' +
                '<h2 style="margin-top:0px !important">'+ action + ' комнаты </h2>' +
                '<span class="label">Имя:</span> <input class="common-input" type="text" id="roomName"/><br/><br/>' +
                '<span class="label">Цвет:</span> <input class="common-input" type="text" id="roomColor"/><br/>' +
                '<br/><br/>' +
                '<div style="text-align:right"><div id="saveRoom" class="common-btn">Сохранить</div></div>'+
                '</div>');
            var popup = new Popup(400, 260, content);
            popup.bindKeyDown(function(event) {
                if (event.keyCode == 13) {
                    $('#saveRoom').click();
                }
            });

            if (room) {
                content.find('#roomName').val(room.Name);
                content.find('#roomColor').val(room.Color);
            }
            content.find('#roomName').focus();
            content.find('#saveRoom').click(function () {
                var name = content.find('#roomName').val();
                var color = content.find('#roomColor').val();
                if (!name) {
                    return;
                }

                room = { Contour: contour, Name: name, Color: color, Items: [], Id:contourKey };
                ctx.Rooms[contourKey] = room;

                closePopup();
            });
        }
    };
}