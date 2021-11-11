$(function () {
  $("img.lazy").lazyload({
    effect: "fadeIn"
  });
  echo.init({
    offset: 100,
    throttle: 250,
    unload: false,
  });
});
$(document).ready(function () {
  $(".slideTab").slide({
    trigger: "click",
    switchLoad: "_src"
  });
  $('#_js_search').submit(function () {
    var folder = jQuery("#_js_search_text").val();
    if (jQuery.trim(folder) == "") {
      showDialogTip({
        error: true,
        tip: "请输入您要搜索的关键词"
      });
      $("#_js_search_text").focus();
      return false;
    }
  });
  var widgetWeixin = $("#widget-weixin");
  if (!zdyCookie.query('_widget_weixin')) {
    widgetWeixin.show();
  }
  widgetWeixin.click(function () {
    zdyCookie.write("_widget_weixin", "0", "/", "10");
    widgetWeixin.hide();
  });
  if(!MAC.Cookie.Get('index_float_qrcode')){
    $(".index-float-qrcode-bg,.index-float-qrcode").show("fast");
  }
  $(".index-float-qrcode .close").click(function(){
    MAC.Cookie.Set('index_float_qrcode',1,1);
    $(".index-float-qrcode-bg,.index-float-qrcode").hide("fast");
  });
  $(".download-tool-box input").change(function(){
    if($(this).is(':checked')){
      MAC.CheckBox.All($(this).attr("to"));
    }else{
      MAC.CheckBox.Other($(this).attr("to"));
    }
  });
  $(".download-tool a").click(function(){
    alert('批量下载失败，请点击单个链接下载');
  });
});
