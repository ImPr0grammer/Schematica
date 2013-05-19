function PointTool(ctx) {

    var _userCoords = false;
    var _isQRCode = false;
    this.activate = function (id) {
        _isQRCode = id == 'QRCode';
        _userCoords = _isQRCode || id == 'coordPoint';
    };

    this.deActivate = function() {
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        
    };

    var hoverContourKey = null;
    this.mouseMove = function (point) {
        var contour = ctx.Graph.findContour(point);
        if (contour) {
            var newKey = getContourKey(contour);
            if (newKey in ctx.Rooms) {
                if (newKey != hoverContourKey) {
                    ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
                    ctx.Graph.highlightContour(contour, ctx);
                    hoverContourKey = newKey;
                }

                ctx.UpCanvas.css('cursor', 'pointer');
                return;
            }
        }
        ctx.UpCanvas.css('cursor', 'default');
        ctx.UpCtx.clearRect(0, 0, ctx.Width, ctx.Height);
        hoverContourKey = null;
    };

    this.click = function (point) {
        var contour = ctx.Graph.findContour(point);
        if (!contour)
            return;
        
        var contourKey = getContourKey(contour);
        var room = ctx.Rooms[contourKey];
        if (!room)
            return;

        ctx.Graph.highlightContour(contour, ctx);

        var caption = _isQRCode ? 'QR-код в "' + room.Name + '"' :
            'Объект в "' + room.Name + '"';
        
        var content = $('<div style="margin:0px 20px">' +
                '<h2 style="margin-top:0px !important"> '+ caption + ' </h2>' +
                '<span class="label">Имя:</span> <input class="common-input" type="text" id="pointName"/>' +
                (_isQRCode ? '<br/><br/><span class="label">QR-код:</span> <input class="common-input" type="text" id="pointQRCode"/>' : '') +
                '<br/><br/>' +
                '<div style="text-align:right"><div id="savePoint" class="common-btn">Сохранить</div></div>' +
                '</div>');
        var popup = new Popup(400, 200 + (_isQRCode ? 60 : 0), content);
        popup.bindKeyDown(function(event) {
            if (event.keyCode == 13) {
                $('#savePoint').click();
            }
        });

        content.find('#pointName').focus();
        content.find('#savePoint').click(function () {
            var name = content.find('#pointName').val();
            if (!name) {
                return;
            }
            
            var pointInfo = { Name: name };
            if (_userCoords) {
                pointInfo.x = point.x;
                pointInfo.y = point.y;
            }
            
            if (_isQRCode) {
                pointInfo.QRCode = content.find('#pointQRCode').val();
            }
            
            room.Items.push(pointInfo);
            closePopup();
        });
    };
}