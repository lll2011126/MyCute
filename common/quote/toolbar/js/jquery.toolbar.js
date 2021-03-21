/**
 * Toolbar.js
 *
 * @fileoverview  jQuery plugin that creates tooltip style toolbars.
 * @link          http://paulkinzett.github.com/toolbar/
 * @author        Paul Kinzett (http://kinzett.co.nz/)
 * @version       1.1.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Toolbar Plugin v1.1.0
 * http://paulkinzett.github.com/toolbar/
 * Copyright 2013 - 2015 Paul Kinzett (http://kinzett.co.nz/)
 * Released under the MIT license.
 * <https://raw.github.com/paulkinzett/toolbar/master/LICENSE.txt>
 */


if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    var ToolBar = {
        init: function( options, elem ) {
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            self.options = $.extend( {}, $.fn.toolbar.options, options );
            self.metadata = self.$elem.data();
            self.overrideOptions();
            self.toolbar = $('<div class="tool-container"/>')
                .attr('id',self.options.id)
                .addClass('tool-'+self.options.position)
                .addClass('toolbar-'+self.options.style)
                .append('<div class="tool-items" />')
                .appendTo('body')
                .css('opacity', 0)
                .css('border-radius',self.options.container.borderRadius)
                .css('height',self.options.container.height)
                .hide();
            self.toolbar_arrow = self.toolbar.find('.arrow');
            if(self.options.arrow){
                self.toolbar.append('<div class="arrow" />')
            }
            self.initializeToolbar();
        },

        overrideOptions: function() {
            var self = this;
            $.each( self.options, function( $option ) {
                if (typeof(self.$elem.data('toolbar-'+$option)) != "undefined") {
                    self.options[$option] = self.$elem.data('toolbar-'+$option);
                }
            });
        },

        initializeToolbar: function() {
            var self = this;
            self.populateContent();
            self.setTrigger();
            self.toolbarWidth = self.toolbar.width();
        },

        setTrigger: function() {
            var self = this;

            if (self.options.event != 'click') {

                var moveTime;
                function decideTimeout () {
                    if (self.$elem.hasClass('pressed')) {
                        moveTime = setTimeout(function() {
                            self.hide();
                        }, 150);
                    } else {
                        clearTimeout(moveTime);
                    };
                };

                self.$elem.on({
                    mouseenter: function(event) {
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    }
                });

                self.$elem.parent().on({
                    mouseleave: function(event){ decideTimeout(); }
                });

                $('.tool-container').on({
                    mouseenter: function(event){ clearTimeout(moveTime); },
                    mouseleave: function(event){ decideTimeout(); }
                });
            }

            if (self.options.event == 'click') {
                self.$elem.on('click', function(event) {
                    event.preventDefault();
                    if(self.$elem.hasClass('pressed')) {
                        self.hide();
                    } else {
                        self.show();
                    }
                });

                if (self.options.hideOnClick) {
                    $('html').on("click.toolbar", function ( event ) {
                        if (event.target != self.elem &&
                            self.$elem.has(event.target).length === 0 &&
                            self.toolbar.has(event.target).length === 0 &&
                            self.toolbar.is(":visible")) {
                            self.hide();
                        }
                    });
                }
            }

            if (self.options.hover) {
                var moveTime;

               function decideTimeout () {
                    if (self.$elem.hasClass('pressed')) {
                        moveTime = setTimeout(function() {
                            self.hide();
                        }, 150);
                    } else {
                        clearTimeout(moveTime);
                    };
                };

                self.$elem.on({
                    mouseenter: function(event) {
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    }
                });

                self.$elem.parent().on({
                    mouseleave: function(event){ decideTimeout(); }
                });

                $('.tool-container').on({

                    mouseenter: function(event){ clearTimeout(moveTime); },
                    mouseleave: function(event){ decideTimeout(); }
                });
            }

            $(window).resize(function( event ) {
                event.stopPropagation();
                if ( self.toolbar.is(":visible") ) {
                    self.toolbarCss = self.getCoordinates(self.options.position, 20);
                    self.collisionDetection();
                    self.toolbar.css( self.toolbarCss );
                    self.toolbar_arrow.css( self.arrowCss );
                }
            });
        },

        populateContent: function() {
            var self = this;
            var location = self.toolbar.find('.tool-items');
            var content = $(self.options.content).clone( true ).find('a').addClass('tool-item').on("dragstart",function (event) {return false;});
            location.html(content);
            $('.tool-container'+'#'+self.options.id).children('.tool-items').children('.tool-item').css('width',self.options.toolItem.height);
            $('.tool-container'+'#'+self.options.id).children('.tool-items').children('.tool-item').css('height',self.options.toolItem.height);
            location.find('.tool-item').on('click', function(event) {
                event.preventDefault();
                self.$elem.trigger('toolbarItemClick',$(this).index(),this);
            });
        },

        calculatePosition: function() {
            var self = this;
                self.arrowCss = {};
                self.toolbarCss = self.getCoordinates(self.options.position, self.options.adjustment);
                self.toolbarCss.position = 'absolute';
                self.toolbarCss.zIndex = self.options.zIndex;
                self.collisionDetection();
                self.toolbar.css(self.toolbarCss);
                self.toolbar_arrow.css(self.arrowCss);
        },

        getCoordinates: function( position, adjustment ) {
            var self = this;
            self.coordinates = self.$elem.offset();

            if (self.options.adjustment && self.options.adjustment[self.options.position]) {
                adjustment = self.options.adjustment[self.options.position] + adjustment;
            }

            switch(self.options.position) {
                case 'top':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top-self.$elem.outerHeight()-adjustment,
                        right: 'auto'
                    };
                case 'left':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)-(self.$elem.outerWidth()/2)-adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'right':
                    return {
                        left: self.coordinates.left+(self.toolbar.width()/2)+(self.$elem.outerWidth()/2)+adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'bottom':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top+self.$elem.outerHeight()+adjustment,
                        right: 'auto'
                    };
            }
        },

        collisionDetection: function() {
            var self = this;
            var edgeOffset = 20;
            if(self.options.position == 'top' || self.options.position == 'bottom') {
                self.arrowCss = {left: '50%', right: '50%'};
                if( self.toolbarCss.left < edgeOffset ) {
                    self.toolbarCss.left = edgeOffset;
                    self.arrowCss.left = self.$elem.offset().left + self.$elem.width()/2-(edgeOffset);
                }
                else if(($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset) {
                    self.toolbarCss.right = edgeOffset;
                    self.toolbarCss.left = 'auto';
                    self.arrowCss.left = 'auto';
                    self.arrowCss.right = ($(window).width()-self.$elem.offset().left)-(self.$elem.width()/2)-(edgeOffset)-5;
                }
            }
        },

        show: function() {
            var self = this;
            self.$elem.addClass('pressed');
            self.calculatePosition();
            self.toolbar.show().css({'opacity': 0.5}).addClass('animate-'+self.options.animation);
            self.$elem.trigger('toolbarShown');
        },

        hide: function() {
            var self = this;
            var animation = {'opacity': 0.5};

            self.$elem.removeClass('pressed');

            switch(self.options.position) {
                case 'top':
                    animation.top = '+=20';
                    break;
                case 'left':
                    animation.left = '+=20';
                    break;
                case 'right':
                    animation.left = '-=20';
                    break;
                case 'bottom':
                    animation.top = '-=20';
                    break;
            }

            self.toolbar.animate(animation, 200, function() {
                self.toolbar.hide();
            });

            self.$elem.trigger('toolbarHidden');
        },

        getToolbarElement: function () {
            return this.toolbar.find('.tool-items');
        }
    };

    $.fn.toolbar = function( options ) {
        if ($.isPlainObject( options )) {
            return this.each(function() {
                var toolbarObj = Object.create( ToolBar );
                toolbarObj.init( options, this );
                $(this).data('toolbarObj', toolbarObj);
            });
        } else if ( typeof options === 'string' && options.indexOf('_') !== 0 ) {
            var toolbarObj = $(this).data('toolbarObj');
            var method = toolbarObj[options];
            return method.apply(toolbarObj, $.makeArray(arguments).slice(1));
        }
    };

    $.fn.toolbar.options = {
        id:'tool',
        arrow:true,
        content: '#myContent',
        position: 'top',
        hideOnClick: false,
        zIndex: 120,
        hover: false,
        style: 'default',
        animation: 'standard',
        adjustment: 10,
        container: {
            borderRadius: '6px',
            height: '40px',
        },
        toolItem: {
            height: '20px',
        }
    };

}) ( jQuery, window, document );
//<div id="toolbar-options" className="hidden">
//     <a href="../toolbox/toolList.html"><i></i></a>
//     <a href="#"><i></i></a>
//     <a href="#"><i></i></a>
// </div>

// $('#coreArea').toolbar({
//     id: 'first',
//     arrow: false,
//     content: '#toolbar-options',
//     position: 'bottom',
//     style: 'primary',
//     // event: 'click'
//     animation: 'bounce',
//     // adjustment: -35,
//     container: {
//         borderRadius: "4px",
//         height: "30px"
//     },
//     toolItem: {
//         height: "10px"
//     }
// });
//
// windowControl.click(thisWindow, $("#first"));

//    var defaultOptions = {
//         initWindow: {
//             width: 600,
//             height: 600,
//         },
//         style: {
//             filePath: '#',
//             alwaysOnTop: false,
//             skipTaskbar: true,//不显示
//             openDevTools: true
//         }
//     };
//
// $('#coreArea').on('toolbarItemClick ', function (event, index, item) {
//         let choice = $('#toolbar-options').children().eq(index);
//         let exist = choice.data('value');
//         if (exist == undefined || exist == null) {
//             defaultOptions.style.filePath = choice.attr('href');
//             let let1 = createNewWin(defaultOptions);
//             if (let1) {
//                 let1.on('closed', () => {
//                     choice.data('value', null);
//                     let1 = null;
//                 });
//                 choice.data('value', let1);//页面存在
//             }
//         } else {
//             exist.show();
//         }
//     }
// );