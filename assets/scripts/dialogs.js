/**
 *  @describe   全局中的  alert 和 confirm 方法
 *  
 */

(function() {

    var util = {
        slice: function (array) {
            return Array.prototype.slice.call(array);
        }
    };

    window.dialogs = {
        /**
         *  $.dialogs.alert('massage', fuction(r){
         *
         *  });
         */

         /*
            @return
            <div id="dialogContainer" class="dialog-wraper">
                <div class="dialog-container">
                    <h2 class="dialog-title"></h2>
                    <p class="dialog-content"></p>

                    <div class="dialog-panel">
                        <div id="dialogCancel" class="dialog-btn tui-btn">取消</div>
                        <div id="dialogSure" class="dialog-btn tui-btn">确定</div>
                    </div>
                </div>
            </div>
         */
        _tpls: function (data, type) {
            var html = '<div id="dialogContainer" class="dialog-wraper"><div class="dialog-container">';

            html += '<h2 class="dialog-title">'+ data.title +'</h2><p class="dialog-content">'+ data.msg +'</p>';

            if(type === 'confirm'){
                html += '<div class="dialog-panel"><div id="dialogCancel" class="dialog-btn tui-btn">取消</div><div id="dialogSure" class="dialog-btn tui-btn">确定</div></div>';
            }else{
                html += '<div class="dialog-panel"><div id="dialogSure" class="dialog-btn tui-btn">确定<span>3</span></div></div>';
            }

            html +='</div></div>';

            return html;
        },
        alert: function(message, callback) {
            this._show(message, 'alert', 'alert', function(result) {
                if( callback ) callback(result);
            });
        },
        /**
         *  $.dialogs.confirm('massage', fuction(r){
         *
         *  });
         */
        confirm: function(message, callback) {
            this._show(message, 'confirm', 'confirm', function(result) {
                if( callback ) callback(result);
            });
        },
        // 显示
        _show: function (msg, title, type, callback) {
            this._hide();
            this._overlay('show');

            var that = this,
                dialogData = {
                    title: title || 'tips',
                    msg: msg,
                    type: type
                };

            $('body').append(this._tpls(dialogData, type));

            this._reposition();
            this._maintainPosition(true);

            switch (type){
                case 'alert':
                    $("#dialogSure").on('click', function() {
                        that._hide();
                        callback(true);
                    });
                break;
                case 'confirm':
                    $("#dialogSure").on('click', function() {
                        that._hide();
                        if( callback ) callback(true);
                    });
                    $("#dialogCancel").on('click', function() {
                        that._hide();
                        if( callback ) callback(false);
                    });
                break;
            }
        },
        bindEvent: function(){
            
        },
        unbindEvent: function(){
            
        },
        // 隐藏
        _hide: function () {
            $('#dialogContainer').remove();
            this._overlay('hide');
            this._maintainPosition(false);
        },
        // 遮罩
        _overlay: function (status) {
            switch( status ) {
                case 'show':
                    this._overlay('hide');
                    $('<div class="dialog-wrap-bg"></div>').appendTo('body').on('touchmove', function(e){
                        e.preventDefault();
                    });
                    break;

                case 'hide':
                    $(".dialog-wrap-bg").remove().off();
                    break;
            }
        },
        // 弹出层定位
        _reposition: function() {
            var $dialogC = $('#dialogContainer'),
                top = (($(window).height() / 2) - ($dialogC.height() / 2) -50 ),
                left = (($(window).width() / 2) - ($dialogC.width() / 2));
            if( top < 0 ) top = 0;
            if( left < 0 ) left = 0;
            
            $dialogC.css({ top: top + 'px', left: left + 'px' });
        },
        // 监听窗口变化
        _maintainPosition: function(status) {
            var $dialogC = $('#dialogContainer'),
                that = this;

            switch(status) {
                case true:
                    $(window).on('resize', function() {
                        that._reposition();
                    });
                break;
                case false:
                    $(window).off('resize');
                break;
            }
        }
    };
})();