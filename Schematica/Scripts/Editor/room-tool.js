function RoomTool(ctx) {

    this.activate = function() {

    };

    this.deActivate = function() {

    };

    this.click = function(point) {
        var contour = ctx.Graph.findContour(point);
        if (contour) {
            for (var i = 0; i < contour.length; ++i) {
                var fromIdx = contour[i];
                var toIdx = contour[(i + 1) % contour.length];
                ctx.Graph.drawSelected({
                    Wall: { From: fromIdx, To: toIdx }
                }, ctx);
            }

            var content = $('<div style="margin:0px 20px">' +
                '<h2 style="margin-top:0px !important">Создание комнаты </h2>' +
                '<span class="label">Имя:</span> <input class="common-input" type="text" id="roomName"/><br/><br/>' +
                '<span class="label">Цвет:</span> <input class="common-input" type="text" id="roomColor"/><br/>' +
                '<br/><br/>' +
                '<div style="text-align:right"><div id="saveRoom" class="common-btn">Сохранить</div></div>'+
                '</div>');
            var popup = new Popup(400, 260, content);
            content.find('#roomName').focus();
        }
    };
}