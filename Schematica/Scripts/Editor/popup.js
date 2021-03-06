﻿
function Popup(width, height, content) {
    var panel = $('<div tabindex="1">&zwj;</div>')
        .css('width', width)
        .css('height', height)
        .css('margin', '100px auto')
        .css('background-color', 'white')
        .css('display','inline-block')
        .css('text-align', 'left')
        .css('position', 'absolute')
        .css('margin-left', '-200px')
        .css('top','100px');


    var _handler = null;
    this.bindKeyDown = function(handler) {
        _handler = handler;
    };
    
    panel.keydown(function (event) {
        event.keyCode = event.keyCode ? event.keyCode : event.which;
        if (event.keyCode == 27)
            closePopup();

        if (_handler)
            _handler(event);
    });

    panel.click(function(event) {
        event.stopPropagation();
    });
    
    if (content)
        content.appendTo(panel);

    var wrapper = $('<div class="popup-wrapper"><div class="opacity-wrapper">&zwj;</div></div>');
    panel.appendTo(wrapper);
    wrapper.appendTo('body');

    wrapper.click(function (event) {
        event.stopPropagation();
        
        if (content)
            content.hide().appendTo('body');
        wrapper.remove();
    });
}

function closePopup() {
    $('.popup-wrapper').remove();
}