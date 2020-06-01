(function() {
    var site = {
        init: function() {
            Typekit.load({
                loading: function() {
                    $(window).resize();
                },
                active: function() {
                    $(window).resize();
                },
                inactive: function() {
                    $(window).resize();
                }
            });
            $(document.body).load(function() {
                $(window).resize();
            });
            setTimeout(function() {
                $(window).resize();
            }, 500);
        }
    }
    $(site.init);
})();