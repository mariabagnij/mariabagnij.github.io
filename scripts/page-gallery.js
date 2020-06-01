$.widget("ui.gallerySlide", {
    options: {},
    _create: function() {
        var self = this;
        this.content = this.element.find(".content:first");
        this.zItems = [];
        this.nameEl = this.element.find(".section-name");
        this.element.find("[data-z]").each(function(k, el) {
            var item = {};
            item.el = $(this);
            item.z = item.el.data('z') * 1;
            self.zItems.push(item);
        });
        var imageSlides = [];
        this.element.find(".item.image").each(function() {
            var el = $(this);
            var img = el.find("img");
            imageSlides.push({
                img: img,
                el: el,
                width: img.attr('width'),
                height: img.attr('height')
            });
        });
        var updateImages = function() {
            for (var k in imageSlides) {
                var slide = imageSlides[k];
                var width = slide.img.height() * slide.width / slide.height;
                slide.img.css('width', width);
                slide.el.css('width', width);
            }
        }
        $(window).resize(function() {
            updateImages();
        }).resize();
        setTimeout(function() {
            updateImages();
        }, 1);
        this.element.find("img").load(function() {
            updateImages();
        })
        this.scroller = this.element.scroller({
            mode: 'position',
            axis: 'x',
            content: this.content,
            mouseDrag: true,
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
    }
})