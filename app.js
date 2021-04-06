let width = window.innerWidth;
let height = window.innerHeight;
let widthcount, heightcount;
let actualwidth, actualheight;
var framenum = 0;

if (width < height) {
    width = width * 0.8;
    widthcount = Math.floor(width / 13);
    heightcount = Math.floor(widthcount * (3 / 4));
} else {
    height = height * 0.8;
    heightcount = Math.floor(height / 13);
    widthcount = Math.floor(heightcount * (4 / 3));
}
if (heightcount > 99) {
    heightcount = 99;
    widthcount = Math.floor(heightcount * (4 / 3));
}
if (widthcount > 99) {
    widthcount = 99;
    heightcount = Math.floor(widthcount * (3 / 4));
}
for (let i = 0; i < heightcount; i++) {
    let div = document.createElement("div");
    for (let j = 0; j < widthcount; j++) {
        let box = document.createElement("input");
        box.type = "checkbox";
        box.setAttribute("id", "" + (i < 10 ? "a" + i : i) + (j < 10 ? "a" + j : j))
        div.appendChild(box);
    }
    document.getElementById("boxes").appendChild(div);
}
actualwidth = widthcount;
actualheight = heightcount;
//6570 30fps 960x720 -> 480x360
let allframes = [];
let fps = 10;
let saveframes = [];
/*VideoToFrames.getFrames('bad_apple.mp4', 219 * fps, VideoToFramesMethod.totalFrames).then(function (frames) {
    frames.forEach(function (frame) {
        var canvas = document.createElement('canvas');
        canvas.width = frame.width;
        canvas.height = frame.height;
        canvas.getContext('2d').putImageData(frame, 0, 0);
        let ctx = canvas.getContext("2d");
        let w = canvas.width;
        let h = canvas.height;
        var imgPixels = ctx.getImageData(0, 0, w, h);

        let savedata = [];
        let savecounter = 0;
        for (var y = 0; y < imgPixels.height; y += 1) {
            let savestr = "";
            for (var x = 0; x < imgPixels.width; x += 1) {
                var i = (y * 4) * imgPixels.width + x * 4;
                var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                if (avg >= 128) {
                    savestr += "1";
                } else {
                    savestr += "0";
                }
            }
            savedata[savecounter] = en(savestr);
            savecounter++;
        }
        saveframes.push(savedata);
/*
        let counter = 0;
        let data = [];
        for (var y = 0; y < imgPixels.height; y += 360.0 / actualheight) {
            data.push("");
            for (var x = 0; x < imgPixels.width; x += 480.0 / actualwidth) {
                var i = (Math.round(y) * 4) * imgPixels.width + Math.round(x) * 4;
                var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                if (avg >= 128) {
                    data[counter] += "1";
                } else {
                    data[counter] += "0";
                }

            }
            counter++;
        }
        //console.log(data);
        allframes.push(data);*/
//});
/*document.getElementById("boxes").removeAttribute("hidden");
document.getElementById("load").setAttribute("hidden", true);
document.getElementById("audio").play();
drawAll();*/

/*var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveframes));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "allframes.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});*/

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        allframes = JSON.parse(this.responseText);
        document.getElementById("boxes").removeAttribute("hidden");
        document.getElementById("start").removeAttribute("hidden");
        document.getElementById("load").setAttribute("hidden", true);
    }
};
xmlhttp.open("GET", "allframes.json", true);
xmlhttp.send();

function start() {
    document.getElementById("audio").volume = 0.3;
    document.getElementById("audio").play();
    document.getElementById("start").setAttribute("hidden", true);
    var vid = setInterval(function(){
        draw(allframes[framenum]);
        framenum++;
    }, 1000/fps)
}

function draw(array) {
    for (let i = 0; i < actualheight; i += 1) {
        for (let j = 0; j < actualwidth; j += 1) {
            try {
                document.getElementById("" + (i < 10 ? "a" + i : i) + (j < 10 ? "a" + j : j)).checked = false;
            } catch (TypeError) {}
        }
    }
    for (let i = 0; i < actualheight; i += 1) {
        for (let j = 0; j < actualwidth; j += 1) {
            if (de(array[Math.floor(i * (360 / actualheight))]).charAt(Math.floor(j * (480 / actualwidth))) == "0") {
                try {
                    document.getElementById("" + (i < 10 ? "a" + i : i) + (j < 10 ? "a" + j : j)).checked = true;
                } catch (TypeError) {}
            }
        }
    }
}

function en(c) {
    var x = "charCodeAt",
        b, e = {},
        f = c.split(""),
        d = [],
        a = f[0],
        g = 256;
    for (b = 1; b < f.length; b++) c = f[b], null != e[a + c] ? a += c : (d.push(1 < a.length ? e[a] : a[x](0)), e[a + c] = g, g++, a = c);
    d.push(1 < a.length ? e[a] : a[x](0));
    for (b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
    return d.join("")
}

function de(b) {
    var a, e = {},
        d = b.split(""),
        c = f = d[0],
        g = [c],
        h = o = 256;
    for (b = 1; b < d.length; b++) a = d[b].charCodeAt(0), a = h > a ? d[b] : e[a] ? e[a] : f + c, g.push(a), c = a.charAt(0), e[o] = f + c, o++, f = a;
    return g.join("")
}