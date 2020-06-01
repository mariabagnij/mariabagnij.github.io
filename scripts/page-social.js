$.widget("ui.socialSlide", {
    _create: function() {
        var self = this;
        this.initGrid();
        this.zItems = [];
        this.nameEl = this.element.find(".section-name");
        this.element.find("[data-z]").each(function(k, el) {
            var item = {};
            item.el = $(this);
            item.z = item.el.data('z') * 1;
            self.zItems.push(item);
        });
        this.element.scroller({
            axis: 'x',
            mode: 'position',
            mouseDrag: true,
            content: this.element.find(".content:first"),
            update: function(pos, percent, max) {
                var transition = percent;
                var amount = document.body.clientWidth * 0.1;
                for (var k in self.zItems) {
                    var offset = transition * amount * self.zItems[k].z;
                    self.zItems[k].el[0].style.marginLeft = offset + 'px';
                }
                self.nameEl.css('left', pos);
            }
        });
        var winky = this.element.find(".emoji-1 div").toggle();
        setInterval(function() {
            winky.toggle();
            setTimeout(function() {
                winky.toggle();
            }, 300);
        }, 2000);
    },
    initGrid: function() {
        var self = this;
        this.cols = this.element.find(".col");
        this.cells = this.element.find(".cell");
        this.imgs = this.element.find(".cell img");
        this.picInfos = this.element.find(".cell.pic .info");
        this.resizeGrid();
        $(window).resize(function() {
            self.resizeGrid();
        });
    },
    resizeGrid: function() {
        var cellSize = this.cells.height();
        this.cols.css('width', cellSize);
        this.picInfos.css('lineHeight', cellSize + 'px');
    }
})