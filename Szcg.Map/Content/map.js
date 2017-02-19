var map;

var pathcontext = "/content";var imgpath = "/";

require(["esri/map",
    "tdlib/TDTLayer",
    "tdlib/TDTAnnoLayer",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/SpatialReference",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "dijit/form/Button",
    "dijit/Toolbar",
    "esri/dijit/Scalebar",
    "dojo/_base/Color",
    "dojo/dom", "dojo/on",
    "dojo/domReady!"],
function (Map,
    TDTLayer,
    TDTAnnoLayer,
    Point,
    Polyline,
    SpatialReference,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Graphic,
    Button, Toolbar,Scalebar,
    Color, dom, on) {

    map = new Map("map", { logo: false });
    map.on("load", initToolBar);

    var basemap = new TDTLayer();
    map.addLayer(basemap);
    var annolayer = new TDTAnnoLayer();
    map.addLayer(annolayer);
    //dojo.connect(map.graphics, "onMouseOver", showgrover)
    //dojo.connect(map.graphics, "onMouseOut", showgrout)
    //dojo.connect(map.graphics, "onClick", showInfowindow)

    //map.centerAndZoom(new Point({ "x": 120.200018, "y": 30.209999, "spatialReference": { "wkid": 4326 } }), 14);

    // fajax("/home/cgrid");


    on(dom.byId("btn-point"), "click", function (evt) {
        ShowLocation(120.4986047744751, 30.54224967956543);
    });
    on(dom.byId("btn-line"), "click", function (evt) {
        var points = [[[120.200018, 30.209999], [120.4986047744751, 30.54224967956543], [120.69658208117, 30.75842902028], [120.69031139171, 30.75591936765]]];
        polyline(points);
    });
    on(dom.byId("btn-mark"), "click", function (evt) {
        var point = { POINT_X: 120.200018, POINT_Y: 30.209999 };
        pointMark(point);
    });


    //坐标画点
    function ShowLocation(x, y) {
        var point = new Point(x, y, new SpatialReference({ wkid: 4326 }));
        var simpleMarkerSymbol = new SimpleMarkerSymbol();
        var graphic = new Graphic(point, simpleMarkerSymbol.setStyle(
        SimpleMarkerSymbol.STYLE_CIRCLE).setColor(
        new Color([0, 0, 0, 0.5])), null, null);

        map.graphics.add(graphic);

    };

    //坐标划线
    function polyline(points) {
        var myLine = {
            geometry: {
                "paths": points,
                "spatialReference": { "wkid": 4326 }
            },
            "symbol": { "color": [0, 0, 0, 255], "width": 1, "type": "esriSLS", "style": "esriSLSSolid" }
        };
        var gra = new Graphic(myLine);
        map.graphics.add(gra);
    }

    //图片标注
    function pointMark(point) {
        var fpaths = pathcontext + imgpath + "gssymbol4.png";
        var myPoint = new esri.geometry.Point(point.POINT_X, point.POINT_Y);
        var fsymbol = new esri.symbol.PictureMarkerSymbol({ "url": fpaths, "height": 12, "width": 12 });
        var fgraphic = new esri.Graphic(myPoint, fsymbol, null);
        map.graphics.add(fgraphic);
    }

    function initToolBar() {
        showscalebar();
    }

    //加载比例尺 
    function showscalebar() {
        var scalebar = new Scalebar({
            map: map,
            //地图对象
            attachTo: "bottom-left",
            //控件的位置，左下角 
            scalebarStyle: "ruler",
            //line 比例尺样式类型 
            scalebarUnit: "metric"
            //显示地图的单位，这里是km 
        });

    }


});



function showMark(result) {
    if (result != undefined) {
        var width = "18";
        var height = "18";
        var fpaths = pathcontext + imgpath + result.mappic;
        //var fpaths = pathcontext + "/Image/syn_hover.png"
        var myPoint = new esri.geometry.Point(result.POINT_X, result.POINT_Y);
        var attr = getattr(result);
        if (result.fclass != undefined) {
            if (result.fclass == "sub" || result.fclass == "xp") {
                height = "12";
                width = "12"
            }
        }
        var fsymbol = new esri.symbol.PictureMarkerSymbol({ "url": fpaths, "height": height, "width": width });
        var fgraphic = new esri.Graphic(myPoint, fsymbol, attr);
        map.graphics.add(fgraphic);
    }
}

function fajax(url) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        dataType: 'json',
        cache: true,
        success: function (result) {
            if (result != null) {
                var zphoto = "";
                var zmemo = "";
                for (var i = 0; i < result.length; i++) {
                    showMark(result[i]);
                }
            }
        },
        error: function (e)
        { alert("出错了") }
    });
}

function getattr(result) {
    var attr = { "ID": result.ID, "folder": result.folder, "photo": result.photo, "zxcs": result.zxcs, "zds": result.zds, "adder": result.adder, "POINT_X": result.POINT_X, "POINT_Y": result.POINT_Y, "mappic": result.mappic, "mappich": result.mappich };
    return attr;
}

function getpoint(result) {
    for (var i = 0; i < result.length; i++) {
        showMark(result[i]);
    }
}

function showInfowindow(evt) {
    var evtgr = evt.graphic;
    if (evtgr.attributes != undefined) {
        getinfowin(evt)
    }
    else {
        alert("没有信息！");
    }
}

function getinfowin(evt) {
    // var evtgr = evt.attributes;
    var evtgr = evt.ID;
    if (evtgr == undefined) {
        getinfowincc(evt.graphic.attributes)
    }
    else {
        getinfowincc(evt)
    }
}
function getinfowincc(result) {
    if (result == undefined) {
        return;
    }
    var ypics = new Array(); //存储已处理的图片数组
    var infoWindows = map.infoWindow;
    var photo = result.photo;
    var POINT_X = result.POINT_X;
    var POINT_Y = result.POINT_Y;
    var status;
    var cldate;

    var content = getcontent(result);
    infoWindows.setContent(content);
    infoWindows.setTitle("公共自行车");

    if (photo != undefined) {
        document.getElementById("clhimg").style.cursor = "default";
        var ephotos = photo;
        var ypics = ephotos.split(','); //存储已处理的图片
        var clhimg = document.getElementById("clhimg");
        clhimg.src = pathcontext + "/ztphoto/ggzxc/" + ypics[0];
    }
    var myPoint = new esri.geometry.Point(POINT_X, POINT_Y);
    map.infoWindow.show(map.toScreen(myPoint), map.getInfoWindowAnchor(map.toScreen(myPoint)));
}
function getcontent(result) {
    var content =
                "<div >" +
                    "<div style='font-size:13px;'>" +
                             "<table >" +
                                "<tr>" +
                                      "<td class='infotdname'>" + "站点编号：" + "</td>" +
                                      "<td class='infotddata'>" + result.zds + "</td>" +
                                "</tr>" +
                                  "<tr>" +
                                     "<td class='infotdname'>" + "自行车数量：" + "</td>" +
                                      "<td class='infotddata'>" + result.zxcs + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                     "<td class='infotdname'>" + "所在位置：" + "</td>" +
                                     "<td class='infotddata'>" + result.adder + "</td>" +
                                "</tr>" +
                         "</table>" +
                  "</div>" +
                  "<div style=';margin-left:60px;width:211px;margin-top:3px;border:1px solid #8D8881;background-color:#ffffff '>" +
                             " <a href='#infoimage' rel='facebox'><img  id='clhimg'  style='margin:5px 5px 5px 5px;height:150px;width:200px'  alt=''/></a>" +
                  "</div>" +
                  "<div id='infoimage' style='display:none'>" +
                         "<image id='dispimg'></image>" +
                "</div>" +
            "</div>"
    return content;
}
function showgrover(evt) {
    var g = evt.graphic;
    var fsymbol;
    var width = "20";
    var height = "20";
    var fpaths = pathcontext + imgpath + g.attributes["mappich"];
    if (g.geometry.type == "polyline") {
        if (g.symbol.style == "solid") {
            fsymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([232, 81, 9]), 5);
        }
        else if (g.symbol.style == "dash") {
            fsymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([232, 81, 9]), 5);
        }
    }
    else if (g.geometry.type == "point") {
        if (g.attributes["fclass"] == "sub" || g.attributes["fclass"] == "xp") {
            height = "14";
            width = "14"
        }
        fsymbol = new esri.symbol.PictureMarkerSymbol({ "url": fpaths, "height": height, "width": width });
    }
    g.setSymbol(fsymbol)
}
function showgrout(evt) {
    var g = evt.graphic;
    var fsymbol;
    var width = "18";
    var height = "18";
    var fpaths = pathcontext + imgpath + g.attributes["mappic"];
    if (g.geometry.type == "polyline") {

        if (g.symbol.style == "solid") {
            fsymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([186, 109, 243]), 5);
        }
        else if (g.symbol.style == "dash") {
            fsymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([186, 109, 243]), 5);
        }
    }
    else if (g.geometry.type == "point") {
        if (g.attributes["fclass"] == "sub" || g.attributes["fclass"] == "xp") {
            height = "12";
            width = "12"
        }
        fsymbol = new esri.symbol.PictureMarkerSymbol({ "url": fpaths, "height": height, "width": width });
    }
    g.setSymbol(fsymbol)
}