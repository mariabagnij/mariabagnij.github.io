$.easing.easeOut = function(n, e, t, a, i) {
    return -a * ((e = e / i - 1) * e * e * e - 1) + t
};
$.widget("ui.mobileSlides", {
    _create: function() {
        var self = this;
        self.currentIndex = 0;
        self.slides = this.element.find(".items:first > .mobile-section");
        self.indicatorPanel = this.element.find("#page-indicators");
        self.slides.each(function(index) {
            var li = $("<span><span></span></span>").appendTo(self.indicatorPanel);
            if (index == 0) li.addClass("active");
            li.click(function() {
                self.goToSlideIndex(index);
            });
            var slide = $(this)
            slide.css({
                display: 'block',
                left: index * 100 + '%'
            });
            slide.find(".scroller").scroller({
                axis: 'y',
                autostartTouch: false,
                mouseDrag: true
            });
        });
        var frameDummy = self.element.find(".frame:first");
        var centeredItems = self.element.find(".frame > .centered");
        $(window).resize(function() {
            centeredItems.each(function() {
                $(this).css({
                    lineHeight: frameDummy.height() + 'px'
                });
            });
        }).resize();
        self.slider = this.element.find(".items:first");
        var touchTimer;
        var speedThreshold = 0.01;
        var touchStartX = 0,
            touchStartY = 0,
            touching = false,
            lastTouchX = 0,
            touchOffset = 0,
            touchVelocity = 0,
            dragAxis = 0;
        var currentScroller = null;
        self.element.bind("touchstart mousedown", function(e) {
            var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
            clearTimeout(touchTimer);
            e.stopPropagation();
            self.slider.stop()
            dragAxis = 0;
            touchStartX = data.pageX;
            touchStartY = data.pageY;
            touchOffset = 0;
            touching = true;
            var scroller = self.slides.eq(self.currentIndex).find(".scroller");
            if (scroller.size()) {
                currentScroller = scroller.data("scroller");
            } else {
                currentScroller = null;
            }
        }).bind("touchend touchcancel touchleave mouseup", function(e) {
            clearTimeout(touchTimer);
            self.slider.stop();
            touching = false;
            if (dragAxis == 1) {
                var wWidth = $(window).width();
                if ((touchOffset > 0 && touchOffset > wWidth * 0.2) || (touchVelocity / wWidth) < -speedThreshold) {
                    self.goToSlideIndex(self.currentIndex - 1, (touchVelocity / wWidth) * 4);
                } else if ((touchOffset < 0 && touchOffset < -wWidth * 0.2) || (touchVelocity / wWidth) > speedThreshold) {
                    self.goToSlideIndex(self.currentIndex + 1, (touchVelocity / wWidth) * 4);
                } else {
                    self.goToSlideIndex(self.currentIndex);
                }
            } else if (dragAxis == 2) {}
        }).bind("touchmove mousemove", function(e) {
            if (!touching) return;
            var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
            if (dragAxis == 0) {
                var xDist = Math.abs(touchStartX - data.pageX);
                var yDist = Math.abs(touchStartY - data.pageY);
                if (xDist > 10) {
                    touchStartX = data.pageX;
                    dragAxis = 1;
                } else if (yDist > 10) {
                    dragAxis = 2;
                }
                if (dragAxis == 2 && currentScroller) {
                    currentScroller.startTouch(e);
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else if (dragAxis == 1) {
                self.slider.stop();
                touchOffset = data.pageX - touchStartX;
                touchVelocity = lastTouchX - data.pageX;
                lastTouchX = data.pageX;
                self.slider.css('margin-left', touchOffset);
                clearTimeout(touchTimer);
                touchTimer = setTimeout(function() {
                    touchVelocity = 0
                }, 100);
                e.preventDefault();
                e.stopPropagation();
            }
        });
        self.element.find(".mobile-home .details a").click(function(e) {
            self.goToSlideIndex(1);
        });
    },
    goToSlideIndex: function(index, speed) {
        if (speed === undefined) {
            speed = 0;
        }
        var self = this;
        if (index < 0) index = 0;
        if (index > self.slides.length - 1) index = self.slides.length - 1;
        self.currentIndex = index;
        self.indicatorPanel.children("span").removeClass("active").eq(index).addClass("active");
        self.slider.css({
            left: self.slider.position().left + parseInt(self.slider[0].style.marginLeft),
            marginLeft: 0
        }).animate({
            left: -$(window).width() * index
        }, {
            duration: 500 - (speed * 300),
            easing: 'easeOut',
            complete: function() {
                self.slider.css({
                    left: -index * 100 + '%'
                });
            }
        });
        self.element.css('backgroundColor', self.slides.eq(index).css('backgroundColor'));
    }
});