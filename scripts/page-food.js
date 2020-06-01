$.widget("ui.menuSlide", {
    _create: function() {
        var self = this;
        self.cols = $(".text-column[data-col]");
        self.col1 = self.cols.eq(0);
        self.col2 = self.cols.eq(1);
        self.items = $(self.cols.first().html());
        self.updateColumns();
        $(window).resize(function() {
            self.updateColumns();
        });
    },
    updateColumns: function() {
        var self = this;
        self.cols.empty();
        var colHeight = self.col1.height()
        var col1inner = $("<div></div>").appendTo(self.col1);
        var flowing = false;
        self.items.each(function() {
            if (flowing) {
                self.col2.append(this);
            } else {
                col1inner.append(this);
                if (col1inner.height() > colHeight) {
                    flowing = true;
                    self.col2.append(this);
                }
            }
        });
    }
});