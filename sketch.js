//Audio Features variables
var 
    danceability = parseFloat(sessionStorage.getItem('danceability') * 100);
    energy = parseFloat(sessionStorage.getItem('energy'));
    key = parseFloat(sessionStorage.getItem('key'));
    loudness = parseFloat(sessionStorage.getItem('loudness'));
    speechiness = parseFloat(sessionStorage.getItem('speechiness'));
    acousticness = parseFloat(sessionStorage.getItem('acousticness'));
    instrumentalness = parseFloat(sessionStorage.getItem('instrumentalness'));
    liveness = parseFloat(sessionStorage.getItem('liveness'));
    valence = parseFloat(sessionStorage.getItem('valence'));
    tempo = parseFloat(sessionStorage.getItem('tempo'));
    duration_ms = parseFloat(sessionStorage.getItem('duration_ms'));
    duration_ms = ~duration_ms + 1;
    time_signature = parseFloat(sessionStorage.getItem('time_signature'));
    track_id = sessionStorage.getItem('track_id');

var 
    handlrot = 0,
    handrrot = 0,
    handerot = 0,
    __Centerx	= 480, 
    __Centery	= 480,
    __Crot	 	= 0,
    __Crota	 	= loudness * 100, 
    __HBx	 	= (30 + key) * 1.5,
    __HBy	 	= (-700 - loudness) * 1.5,
    __Hdist	 	= (1174 - time_signature * 10) * 1.5,
    __Lrot	 	= 0,
    __Lrota	 	= duration_ms * key, 
    __Larm1	 	= (120 + liveness) * 1.5,
    __Larm2	 	= (860 - acousticness) * 1.5,
    __Rrot	 	= 0,
    __Rrota	 	= duration_ms, 
    __Rarm1	 	= (tempo) * 1.5,
    __Rarm2	 	= (1050 - tempo) * 1.5,
    __Ext	 	= (75) * 1.5,
    __Erot	 	= 0,
    __Erota	 	= 0,
    __Earm	 	= 0,


    AM = Math.PI/180,
    CW, CH,

    handsX, handsY,
    H1X, H1Y, H2X, H2Y,
    H1arm1X, H1arm1Y, H2arm1X, H2arm1Y,
    DRX, DRY, DReX, DReY, DRaX, DRaY,

    FX, FY,

    LX, LY,
    FirstX, FirstY,
    firstPoint = true,

    freeze = false,
    totalLength = 0,

    brightness,
    livespeed = 1,
    nolivespeed = 10,
    speed = nolivespeed,
    colormode = 0,

    variablewidth = true,

    font = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-/=*;:,.<>", "0204284442324335464738181215080307480525452224683316263634174130100106373120004014232713", "4ABCDE/BD 4AFGDHIJKLM/NH/OL 4GFMPQLKJ 4AFGJKO/LM 4EAOR/ST 4AOR/ST 4HUEMPQLR 4ER/US/OA 2VA/ML/CO 4RGFMP 4ENR/AO/NS 4EAO 4ERWOA 4REOA 4UGFMPQLKJU 4SHIJKOA 4DVMPQLKJD 4ENHIJKOA/NS 4JKLQGFMP 4RO/CV 4RGFMPO 6XFO 6XEHVO 4RA/EO 4RTO/TV 4EARO 4YVMPSZaHYE 4OBabUGFVBA 4EMPSZI 4EDVMPSZaDR 4FMPSZbUcB 4MdCKJ/HS 4EMPSZbUefgh 4BabUE/AO 0Ai/QO 3Kj/bklgh 4EWI/AO/WB 1MPO 4Ai/SZTbUE/WT 4Ai/BabUE 4GFMPSZbUG 4mi/SZbUGFA 4nI/EMPSZbU 4Ai/BabU 4IZSocGFA 4GFpC/Ii 4IE/DVMPi 4IVi 4IFaMi 4IA/Ei 4Igm/Vi 4EAIi 3YVMPQLCjY 2QLM/VA 4EABNHIJKLQ 4QLKJIHDGFMP/TH 4DBKF 4ROibUGFMP 4SHDGFMPiCK 4ORV 4NBPMFGDHNiQLKJIH 4UNiQLKJDVM 4pq/US 4US 4RA 4Ii/DB 4US/pq/JP/GQ 1ZN/oMh 1ZN/or 1rMh 0PA 3KSF 3OHA"],

    end;


// Drawing here...

var canvas = document.getElementById("theBitmap"),
    ctx = canvas.getContext("2d"),
    canvas2 = document.getElementById("theBitmapOverlay"),
    ctx2 = canvas2.getContext("2d"),
    canvas3 = document.getElementById("theBitmapTextOverlay"),
    ctx3 = canvas3.getContext("2d"),
    canvasb = document.getElementById("buffer"),
    ctxb = canvasb.getContext("2d"),
    W=960, H=960, bw = 480, bh = 480;

canvas.width = W*M;
canvas.height = H*M;
canvas2.width = W*M;
canvas2.height = H*M;
canvas3.width = W*M;
canvas3.height = H*M;
canvasb.width = bw;
canvasb.height = bh;
canvasb.style.width = "240px";
canvasb.style.height = "240px";

function onResize() {

    var ch = window.innerHeight;
    if( CH == ch ) return;
    CH = ch;
    if( CH < 480 ) CH = 480;
    if( CH < H ) {
        CW = W*(CH/H);
    } else {
        CH = H, CW = W;
    }
    canvas.style.width = CW+"px";
    canvas.style.height = CH+"px";
    canvas2.style.width = CW+"px";
    canvas2.style.height = CH+"px";
    canvas3.style.width = CW+"px";
    canvas3.style.height = CH+"px";

    $("#gallery").css( { top: CW+"px", "min-width": CH+"px" } );

}
onResize();

ctx2.globalCompositeOperation = 'screen';

function alphafillcanvas( ctx, a ) {
    var imgd = ctx.getImageData(0, 0, W*M, H*M),
        pix = imgd.data;

    for (var i = 0, n = pix.length; i <n; i += 4) {
        pix[i + 3] = pix[i + 3] * a;
    }

    ctx.putImageData(imgd, 0, 0);
}

function alphafillcanvas( ctx ) {
    var imgd = ctx.getImageData(0, 0, W*M, H*M),
        pix = imgd.data;
    ctx.putImageData(imgd, 0, 0);
}

function mainloop() {
    window.raf( mainloop );

    if( !freeze ) {

        for( var i=0; i<speed; i++ ) {

            calc();
            draw();
            if( i >= speed-1 ) drawmech();

            __Crot = doRot( __Crot, __Crota);
            __Lrot = doRot( __Lrot, __Lrota );
            __Rrot = doRot( __Rrot, __Rrota );
            __Erot = doRot( __Erot, __Erota );
            if( freeze ) break;
        }
    }
}

function doRot( rot, rota ) {
    return (rot + rota + 360)%360;
}

function calc() {

    handsX = __Centerx + __HBx;
    handsY = __Centery + __HBy;

    H1X = handsX - __Hdist/2;
    H1Y = handsY;
    H2X = handsX + __Hdist/2;
    H2Y = handsY;

    H1arm1X = Math.cos( __Lrot*AM )*__Larm1 + H1X;
    H1arm1Y = Math.sin( __Lrot*AM )*__Larm1 + H1Y;

    H2arm1X = Math.cos( __Rrot*AM )*__Rarm1 + H2X;
    H2arm1Y = Math.sin( __Rrot*AM )*__Rarm1 + H2Y;


    var dx = H2arm1X-H1arm1X,
        dy = H2arm1Y-H1arm1Y,
        D = Math.sqrt( dx*dx + dy*dy ),

        gamma = Math.acos( (__Rarm2*__Rarm2 + __Larm2*__Larm2 - D*D)/(2*__Rarm2*__Larm2) ),
        alpha = Math.asin( __Rarm2/(D/Math.sin(gamma)) ),
        beta = Math.asin( __Larm2/(D/Math.sin(gamma)) ),
        delta = Math.asin( dy/D );

    if( __Larm2 > __Rarm2 ) {
        beta = Math.PI-alpha-gamma;
    }
    if( __Rarm2 > __Larm2  ) {
        alpha = Math.PI-beta-gamma;
    }

    var H1a = alpha+delta,
        H2a = Math.PI-(beta-delta),
        Exa = __Erot*AM;

    DRX = H1arm1X + Math.cos( H1a )*__Larm2;
    DRY = H1arm1Y + Math.sin( H1a )*__Larm2;

    DReX = H2arm1X + Math.cos( H2a )*(__Rarm2+__Ext);
    DReY = H2arm1Y + Math.sin( H2a )*(__Rarm2+__Ext);


    DRaX = DReX + Math.cos( H2a+Exa )*__Earm;
    DRaY = DReY + Math.sin( H2a+Exa )*__Earm;

    var nx = DRaX - __Centerx,
        ny = DRaY - __Centery,

        nd = Math.sqrt( nx*nx + ny*ny ),
        na;

    if( nd==0 ) {
        na = 0;
    } else {
        na = Math.asin( ny/nd );
    }

    if( nx<0 ) {
        na = Math.PI - na;
    }

    na = na + AM*__Crot;

    noplot = ( nd>479 && cutpixels );
    if( noplot ) nd = 479;

    FX = __Centerx + Math.cos( na )*nd;
    FY = __Centery + Math.sin( na )*nd;

    precision = 10;
    if( firstPoint ) {
        FirstX = Math.floor(FX*precision);
        FirstY = Math.floor(FY*precision);
        firstPoint = false;
    } else if( Math.floor(FX*precision)==FirstX && Math.floor(FY*precision)==FirstY && totalLength>1 ) {
        freeze = true;
        updatetext();
    }
}


function drawmech() {

        //clr();
    if( speed < 10 ) {
        ctx.strokeStyle="#FFFFFF";
        ctx.lineWidth = 1*M;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.beginPath();
        ctx.moveTo(H1X*M,H1Y*M);
        ctx.lineTo(H1arm1X*M,H1arm1Y*M);
        ctx.lineTo(DRX*M,DRY*M);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(H2X*M,H2Y*M);
        ctx.lineTo(H2arm1X*M,H2arm1Y*M);
        ctx.lineTo(DReX*M,DReY*M);
        ctx.lineTo(DRaX*M,DRaY*M);
        ctx.stroke();

    }

}

function draw() {

    var lw = 1;

    if( LX ) {
        var dx = FX-LX, dy = FY-LY, d = 2*Math.sqrt( dx*dx + dy*dy );
    } else {
        var d = 0;
    }
    if( variablewidth || colormode==0 ) {
        var b = brightness<4?brightness:1;
        var dd = Math.sqrt( d/b )*1.8;
        if( dd>15 ) dd = 15;
        if( dd>0 ) lw = 15/dd;
        if( lw>5 ) lw = 5;
        if( lw<1 ) lw = 1;
        lw = lw/1.6;
    }

    switch( colormode ) {
        case 0:
            var col1 = Math.sin( AM*__Lrot )*127+127,
                col2 = Math.sin( AM*__Rrot )*127+127,
                R = Math.floor(col1),
                G = Math.floor((col1 + col2)/2),
                B = Math.floor(col2),
                A = ((col1 + col2)/256);
    }


    A /= ( brightness>3 ? 5*(brightness-2): 1 );

    if( LX ) {
        if( !noplot ) {
            ctx2.strokeStyle="rgba("+R+","+G+","+B+","+A+")";
            ctx2.lineWidth = lw;
            ctx2.beginPath();
            ctx2.moveTo(LX*M,LY*M);
            ctx2.lineTo(FX*M,FY*M);
            ctx2.stroke();
        }

        totalLength += d/1.6;

    }
    LX = FX;
    LY = FY;

}


// Fonting here...
function polarToLinear( p ) {
    var r = p.r, a = p.a, x, y;
    //var AM = 180/Math.PI;
    a = ((a+360)%360)*AM;

    x = Math.cos( a )*r;
    y = -Math.sin( a )*r;

    return { x: x, y: y }
}

// -------------- FONT
function getchardata( chr ) {
    var i=font[0].lastIndexOf( chr ),
        data=[];
    if( i>-1 ) {
        var chdata = font[2].split(" ")[i],
            l = 0;
        data[0] = Number(chdata.substr(0,1));
        for( var p=0,pi; p<chdata.length; p++ ) {
            pi = getindex( chdata.charCodeAt(p) );
            if( pi<0 ) data[++l] = [];
            else data[l].push( font[1].substr( pi ,2 ) );
        }
    } else data[0]=chr==" "?3:-1;
    return data;
}
function getindex( code ) {
    code-=65;
    code>25&&(code-=6);
    return code*2;
}

function makeText( txt, chs ) {
    var width,
        pos = 0,
        data = [0];
    chs = chs==undefined?1: chs;
    for( var i=0, cdata; i<txt.length; i++ ) {
        cdata = getchardata( txt.substr( i, 1 ) );
        if( cdata[0]>=0 ) {
            for(var l=1; l<cdata.length; l++ ) {
                for( var p=0, pt, line=[]; p<cdata[l].length; p++ ) {
                    pt = cdata[l][p].split("");
                    line.push( { x: Number(pt[0])+pos, y: Number(pt[1]) } );
                }
                data.push( line );
            }
            pos += chs+cdata[0];
        }
    }
    if( pos>0 ) data[0] = pos-1;
    return data;
}

function renderCanvasPrecisionPolarText( ctx, tdata, textB, pixH, plotAngle, sc, lw, sa, reversed ) {

    var angularLength = tdata[0]*plotAngle,		// angular length of the text
        ba = angularLength/2 + sa,				// base angle
        dir = reversed? -1: 1;
    //	out = '<g class="text">';
    ctx.strokeStyle="#333333";
    ctx.lineWidth = lw;
    ctx.lineCap="square";
    ctx.lineJoin="round";


    for( var i=1, first; i<tdata.length; i++ ) {
        //	out += '<polyline fill="none" stroke="#444" stroke-width="0.5" stroke-linecap="square" stroke-miterlimit="1"  points="';
        ctx.beginPath();
        first = true;

        for( var p=0, a, r, dot, dx, inc, lx, ly, x, y, mp=tdata[i].length; p<mp; p++ ) {

            x = tdata[i][p].x;
            y = tdata[i][p].y;
            if( p==0 ) {
                lx = x;
                ly = y
                a = (-lx * plotAngle + ba)*dir;
                r = (ly-5)*dir * pixH + textB;
                dot = polarToLinear( { r: r, a: a } );
                //out += fix2(dot.x*sc) + " " +fix2(dot.y*sc) + " ";
                if( first ) {
                    first = false;
                    ctx.moveTo(dot.x*sc+480*M,dot.y*sc+480*M);
                } else {
                    ctx.lineTo(dot.x*sc+480*M,dot.y*sc+480*M);
                }
            } else {
                dx = Math.abs( x-lx );
                if( dx==0 ) {
                    dx=1;
                }
                ix = ( x-lx )/dx;
                iy = ( y-ly )/dx;
                for( var s=1, X, Y; s<=dx; s++ ) {
                    Y = ly + iy*s;
                    X = lx + ix*s;
                    a = (-X * plotAngle + ba)*dir;
                    r = (Y-5)*dir * pixH + textB;
                    dot = polarToLinear( { r: r, a: a } );
                    //out += fix2(dot.x*sc) + " " + fix2(dot.y*sc) + " ";
                    if( first ) {
                        first = false;
                        ctx.moveTo(dot.x*sc+480*M,dot.y*sc+480*M);
                    } else {
                        ctx.lineTo(dot.x*sc+480*M,dot.y*sc+480*M);
                    }
                }
                lx = x;
                ly = y;
            }
        }
        ctx.stroke();
    }
}

function titleText() {
    var tdata = makeText("*- audioartist -*", 5);
    textH = 2*M;
    textB = 440*M,
        plotAngle = 180/(textB*Math.PI/textH);
    renderCanvasPrecisionPolarText( ctx3, tdata, textB, textH, plotAngle, 1, 1.5*M, 89 );
}

function updatetext() {
    captioninvalid = false;
    invalidatecaption = false;
    alphafillcanvas( ctx3, 0 );

    titleText()

    tdata = makeText(
        "Track ID: " + track_id, 4),
        textH = 1.6*M;
        textB = 440*M,
        plotAngle = 180/(textB*Math.PI/textH);

    renderCanvasPrecisionPolarText( ctx3, tdata, textB, textH, plotAngle, 1, 1.5*M, 90, true );
}

$( function() {
    $(window).bind("resize", onResize );
    window.raf = (function(){
        return 	window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ) {
                window.setTimeout( callback, 100/6 );
            };
    })();
    mainloop();
    titleText();

} );
