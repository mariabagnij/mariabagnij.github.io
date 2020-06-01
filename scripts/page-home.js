$.widget("ui.homeSlide", {
    options: {},
    _create: function() {
        var self = this;
        this.element.find(".section-name .inner").click(function() {
            self.element.addClass("info-visible");
        });
        this.element.find(".info").click(function() {
            self.element.removeClass("info-visible");
        });
    }
})