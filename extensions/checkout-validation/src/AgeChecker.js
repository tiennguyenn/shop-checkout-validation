function initPopup(w, d) {
  var config = {
    mode: "manual",
    key: "Hix8qri6gxpJOP3PSHsmOilzehv8OTpI",
    show_close: true,
    logo_url: "https://pg.getwaave.co/img/logo.png",
    onhide: function () {
      $("body").css("overflow", "unset");
    },
    onready: function () {
      const uuid = "uuid";
      AgeCheckerAPI.show(uuid);
    },
    onshow: function () {
      var agecheckerFooterStr =
        "" +
        '<div style="display:inline-block;margin-right: 20px;">' +
        'Need help? Email us at <a href="mailto:support@getwaave.com" target="_blank"><span>support@getwaave.com</span></a>' +
        "</div>" +
        '<div style="display:inline-block;">' +
        '<a href="http://static.getwaave.co/info/tos.html" target="_blank" rel="noopener">Terms of Service & Privacy Policy</a>' +
        "</div>";
      $("#agechecker #ac-footer").html(agecheckerFooterStr);
    },
    onstatuschanged: function (verification) {
      $("#agechecker-modal").remove();
      $("body").css("overflow", "unset");
    },
  };

  w.AgeCheckerConfig = config;
  if (
    config.path &&
    (w.location.pathname + w.location.search).indexOf(config.path)
  ) {
    return;
  }

  var h = d.getElementsByTagName("head")[0];
  var a = d.createElement("script");
  a.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
  a.crossOrigin = "anonymous";
  a.onerror = function (a) {
    w.location.href = "https://agechecker.net/loaderror";
  };
  h.insertBefore(a, h.firstChild);
}

export default {
  showPopup: () => {
    initPopup(window, document);
  },
};
