$.widget("ui.slides", {
    _create: function() {
        var self = window.slides = this;
        this.scrollTarget = $("#site-wrapper");
        this.currentIndex = Math.floor(($(window).scrollTop() + 200) / $(window).height());
        this.items = this.element.children(".section");
        this.pageTitle = $("#page-title");
        this.initHeader();
        this.initMenu();
        this.items.each(function(index, item) {
            item = $(item);
            var start = [0, 0];
            item.find(".arrow-zone.up").click(function(e) {
                e.stopPropagation();
                var dist = Math.sqrt(Math.pow(e.pageX - start[0], 2) + Math.pow(e.pageY - start[1], 2));
                if (dist < 30) {
                    self.goToSlideIndex(index - 1);
                }
            });
            item.find(".arrow-zone.down").click(function(e) {
                e.stopPropagation();
                var dist = Math.sqrt(Math.pow(e.pageX - start[0], 2) + Math.pow(e.pageY - start[1], 2));
                if (dist < 30) {
                    self.goToSlideIndex(index + 1);
                }
            });
            item.find(".arrow-zone").mousedown(function(e) {
                start = [e.pageX, e.pageY];
            });
        });
        $(window).keydown(function(e) {
            if (e.keyCode == 40) {
                self.goToSlideIndex(self.currentIndex + 1);
            } else if (e.keyCode == 38) {
                self.goToSlideIndex(self.currentIndex - 1);
            }
        });
        $(window).resize(function() {
            self.goToSlideIndex(self.currentIndex, true);
        });
    },
    initHeader: function() {
        var self = this;
        var header = $(document.getElementById("site-header"));
        header.find(".logo").click(function() {
            self.goToSlideIndex(0);
            self.hideMenu();
        });
        header.find(".menu-toggle").click(function() {
            self.showMenu();
        });
    },
    initMenu: function() {
        var self = this;
        var menuEl = $("<div id='main-menu'></div>").appendTo(this.element);
        var menuList = $("<ul></ul>").appendTo(menuEl);
        this.items.each(function(index, item) {
            var label = $(item).data("nav");
            if (!label) return;
            var li = $("<li></li>").appendTo(menuList);
            var link = $("<a></a>").appendTo(li).text(label);
            link.click(function(e) {
                e.stopPropagation();
                self.hideMenu();
                setTimeout(function() {
                    self.goToSlideIndex(index);
                }, 400);
            });
        });
        menuEl.click(function() {
            self.hideMenu();
        });
    },
    showMenu: function() {
        $(document.body).addClass("menu-visible");
    },
    hideMenu: function() {
        $(document.body).removeClass("menu-visible");
    },
    goToSlideIndex: function(index, instant) {
        if (index < 0) index = 0;
        if (index > this.items.size() - 1) index = this.items.size() - 1;
        this.currentIndex = index;
        var targetScroll = index * this.element.height();
        var title = this.items.eq(index).data("title");
        if (instant) {
            this.scrollTarget.stop().scrollTop(targetScroll);
            this.pageTitle.stop().show().text(title);
        } else {
            this.scrollTarget.stop().animate({
                scrollTop: targetScroll
            });
            this.pageTitle.stop().show().text(title);
        }
    }
});