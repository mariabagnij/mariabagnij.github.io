(function($) {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 30);
        };
    })();
    var AXIS_X = 1;
    var AXIS_Y = 2;
    var MODE_SCROLL = 1;
    var MODE_POSITION = 2;
    $.fn.disableScroll = function() {
        return this.each(function() {
            var handleWheel = function(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            $(this).bind("mousewheel", handleWheel);
            $(this).bind("DOMMouseScroll", handleWheel);
        });
    }
    $.fn.scroller = function(options) {
        var args = arguments;
        return this.each(function(index) {
            var scroller = $.data(this, 'scroller');
            if (typeof args[0] == 'string') {
                if (!scroller) {
                    throw new Error("Called scroller method '" + args[0] + "' before actually initializing one.");
                } else if (args[0] in scroller == false) {
                    throw new Error("Attempted to call invalid scroller method '" + args[0] + "'");
                } else {
                    var methodArgs = Array.prototype.slice.call(args, 1);
                    scroller[args[0]].apply(scroller, methodArgs);
                }
            } else if (options == undefined || typeof options == 'object') {
                if (!scroller) {
                    createScroller($(this), options || {});
                } else {
                    scroller.options(options);
                }
            }
        });
    };
    var createScroller = function(scrollEl, options) {
        var options = jQuery.extend({
            receiver: scrollEl,
            content: scrollEl,
            frame: scrollEl,
            axis: 'y',
            mode: 'scroll',
            mousewheel: true,
            mouseDrag: false,
            touchDrag: true,
            autostartTouch: true,
            friction: 0.9,
            stepSize: 1,
            minMovement: 0.1,
            disabled: false,
            getCurrentPosition: null,
            getContentSize: null,
            getFrameSize: null,
            update: null,
        }, options);
        var running = false,
            currentPos = 0,
            targetPos = 0,
            lastPos = 0,
            minScroll = 0,
            maxScroll = 0,
            direction, velocity = 0,
            axisID = (options.axis == 'x' && AXIS_X) || (options.axis == 'y' && AXIS_Y),
            modeID = (options.mode == 'scroll' && MODE_SCROLL) || (options.mode == 'position' && MODE_POSITION),
            isDragging = false,
            dragStartPos = 0,
            dragStartPagePos = 0,
            lastDragPos = 0,
            dragSpeed = 0;
        var updateScrollTarget = function(delta) {
            targetPos += delta;
            velocity += (targetPos - lastPos) * options.stepSize;
            lastPos = targetPos;
        }
        var render = function(force) {
            if (velocity < -(options.minMovement) || velocity > options.minMovement || force) {
                updateScrollSize();
                currentPos = (currentPos + velocity);
                if (maxScroll > 0) {
                    currentPos = 0;
                    velocity = 0;
                } else if (currentPos < maxScroll) {
                    velocity = 0;
                    currentPos = maxScroll;
                } else if (currentPos > minScroll) {
                    velocity = 0;
                    currentPos = minScroll;
                }
                if (modeID == MODE_SCROLL) {
                    if (axisID == AXIS_Y) {
                        options.frame.scrollTop(-currentPos);
                    } else if (axisID == AXIS_X) {
                        options.frame.scrollLeft(-currentPos);
                    }
                } else if (modeID == MODE_POSITION) {
                    if (axisID == AXIS_Y) {
                        options.content.css('top', currentPos + 'px');
                    } else if (axisID == AXIS_X) {
                        options.content.css('left', currentPos + 'px');
                    }
                }
                if (options.update) {
                    options.update(currentPos, currentPos / maxScroll, maxScroll);
                }
                velocity *= options.friction;
            }
        }
        var updatePosition = function() {
            if (modeID == MODE_SCROLL) {
                if (axisID == AXIS_Y) {
                    currentPos = -options.frame.scrollTop();
                } else if (axisID == AXIS_X) {
                    currentPos = -options.frame.scrollLeft();
                }
            } else if (modeID == MODE_POSITION) {
                if (axisID == AXIS_Y) {
                    currentPos = parseFloat(options.content[0].style.top) || 0;
                } else if (axisID == AXIS_X) {
                    currentPos = parseFloat(options.content[0].style.left) || 0;
                }
            }
        }
        var animateLoop = function() {
            if (!running) return;
            requestAnimFrame(animateLoop);
            render();
        }
        var handleWheel = function(e) {
            if (options.disabled) return;
            e.stopPropagation();
            e.preventDefault();
            var evt = e.originalEvent;
            var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
            var dir = delta < 0 ? -1 : 1;
            if (dir != direction) {
                velocity = 0;
                direction = dir;
            }
            updatePosition();
            updateScrollTarget(delta);
        }
        var updateScrollSize = function() {
            var contentSize = 0,
                frameSize = 0;
            if (options.getFrameSize) {
                frameSize = options.getFrameSize();
            } else {
                if (axisID == AXIS_Y) {
                    frameSize = options.frame[0].clientHeight;
                } else if (axisID == AXIS_X) {
                    frameSize = options.frame[0].clientWidth;
                }
            }
            if (options.getContentSize) {
                contentSize = options.getContentSize();
            } else if (modeID == MODE_SCROLL) {
                if (axisID == AXIS_Y) {
                    contentSize = options.frame[0].scrollHeight;
                } else if (axisID == AXIS_X) {
                    contentSize = options.frame[0].scrollWidth;
                }
            } else if (modeID == MODE_POSITION) {
                if (axisID == AXIS_Y) {
                    contentSize = options.content[0].clientHeight;
                } else if (axisID == AXIS_X) {
                    contentSize = options.content[0].clientWidth;
                }
            }
            maxScroll = -(contentSize - frameSize);
        }
        if (options.mousewheel == true) {
            options.receiver.bind("mousewheel", handleWheel);
            options.receiver.bind("DOMMouseScroll", handleWheel);
            updatePosition();
            targetPos = lastPos = currentPos;
            updateScrollSize();
            if (options.remove) {
                running = false;
                options.receiver.unbind("mousewheel", handleWheel);
                options.receiver.unbind("DOMMouseScroll", handleWheel);
            } else if (!running) {
                running = true;
                animateLoop();
            }
        }
        var eventAxis = options.axis == 'y' ? 'pageY' : 'pageX';
        var touchStartFunc;
        if (options.touchDrag && ('ontouchstart' in window)) {
            touchStartFunc = function(e) {
                if (e.originalEvent.touches) {
                    var touch = e.originalEvent.touches[0];
                    isDragging = true;
                    dragStartPagePos = touch[eventAxis];
                    dragStartPos = currentPos;
                    lastDrag = 0;
                    dragSpeed = 0;
                }
            }
            options.receiver.bind("touchstart", function(e) {
                if (options.autostartTouch) {
                    e.preventDefault();
                    e.stopPropagation();
                    touchStartFunc(e);
                }
            });
            $(window).bind("touchend touchcancel touchleave", function(e) {
                if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                    isDragging = false;
                    velocity = -dragSpeed;
                    dragSpeed = 0;
                }
            }).bind("touchmove", function(e) {
                if (isDragging) {
                    var touch = e.originalEvent.touches[0]
                    dragSpeed = lastDragPos - touch[eventAxis];
                    lastDragPos = touch[eventAxis];
                    currentPos = dragStartPos - (dragStartPagePos - touch[eventAxis]);
                    render(true);
                }
            });
        }
        var mouseStartFunc;
        if (options.mouseDrag) {
            mouseStartFunc = function(e) {
                if (e.pageX || e.pageY) {
                    isDragging = true;
                    dragStartPagePos = e[eventAxis];
                    dragStartPos = currentPos;
                    lastDrag = 0;
                    dragSpeed = 0;
                }
            }
            options.receiver.bind("mousedown", function(e) {
                if (options.autostartTouch) {
                    e.preventDefault();
                    e.stopPropagation();
                    mouseStartFunc(e);
                }
            });
            $(window).bind("mouseup", function(e) {
                e.preventDefault();
                e.stopPropagation();
                isDragging = false;
                velocity = -dragSpeed;
                dragSpeed = 0;
            }).bind("mousemove", function(e) {
                if (isDragging) {
                    dragSpeed = lastDragPos - e[eventAxis];
                    lastDragPos = e[eventAxis];
                    currentPos = dragStartPos - (dragStartPagePos - e[eventAxis]);
                    render(true);
                }
            });
        }
        var scroller = {
            refresh: function() {
                updatePosition();
                render(true);
            },
            disable: function() {
                options.disabled = true;
            },
            enable: function() {
                options.disabled = false;
            },
            startTouch: function(e) {
                if (touchStartFunc) touchStartFunc(e);
                if (mouseStartFunc) touchStartFunc(e);
            }
        }
        window.scroller = scroller;
        $.data(scrollEl[0], 'scroller', scroller);
    }
})(jQuery);