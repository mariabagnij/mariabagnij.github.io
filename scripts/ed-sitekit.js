var SiteKit = {};
(function($) {
    SiteKit.initWidgets = function(targetEl) {
        targetEl = $(targetEl || document.body);
        targetEl.find("[data-widget]").each(function() {
            var el = $(this);
            var data = el.data();
            if (data.hasBeenInitialized) return;
            if (data.widget in $.fn == false) {
                throw new Error("Could not initialize widget '" + data.widget + "', as no widget with this name has been declared.");
            }
            el.data('hasBeenInitialized', true);
            el[data.widget](data);
        });
    }
    SiteKit._xhrErrorCodes = {
        "timeout": "Timed out while making API request",
        "abort": "XHR request was aborted",
        "error": "XHR request encountered an error",
        "parsererror": "Unable to parse API request"
    }
    SiteKit.callAPI = function(method, args, callback) {
        if (args instanceof Function) {
            callback = args;
            args = null;
        }
        console.log("Calling");
        $.ajax({
            method: 'post',
            url: "/json-api/" + method,
            data: JSON.stringify(args),
            dataType: "json",
            success: function(response) {
                callback(response.error, response.result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var message = "";
                if (textStatus && SiteKit._xhrErrorCodes[textStatus]) {
                    message = SiteKit._xhrErrorCodes[textStatus];
                } else {
                    message = "Server error occurred while making API request";
                }
                if (errorThrown && message) {
                    message += ": " + errorThrown;
                }
                callback({
                    code: textStatus || errorThrown,
                    message: message,
                    info: null
                }, null);
            }
        });
    }
    $(function() {
        SiteKit.initWidgets();
    });
})(jQuery);
if (jQuery) $ = jQuery;