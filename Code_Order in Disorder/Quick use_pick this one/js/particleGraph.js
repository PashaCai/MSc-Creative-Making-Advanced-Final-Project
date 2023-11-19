/*          
*粒子化类构造 particleised class construction
    *类功能：Class function: 
    *1.初始化。创建画布，规定粒子属性等；1. Initialisation. Create the canvas, specify particle properties, etc;
    *2.创建图像并且进行绘制 2. Create an image and draw it
    *3.区域颜色定义 3. Area colour definition
    *4.粒子移动和偏射角度 4. Particle movement and deflection angle
*/

// 生成粒子 Generating particles
let Particle = function(context, options){
    this.context = context;
    // 在画布里的x坐标 x-coordinate in the canvas
    this.x = options.x;
    // 在画布里的y坐标 y-coordinate in the canvas
    this.y = options.y;
    // 画布中心点坐标 Canvas centre point coordinates
    this.centerX = options.centerX;
    this.centerY = options.centerY;
    // 当前坐标相对于圆心的距离 The distance of the current coordinate from the centre of the circle
    this.R = Math.sqrt(Math.pow((this.x - this.centerX), 2) + Math.pow((this.y - this.centerY), 2));
    // 图层的半径 Radius of the layer
    this.canvasR = options.canvasR;
    // 当前坐标相对于中心点圆心弧度 Current coordinates relative to the centre radian of the centre point
    this.tan = Math.atan2((this.y - this.centerY), (this.x - this.centerX));
    // 当前粒子半径 Current particle radius
    this.radius = options.radius || 0.3 + Math.random() * 23.7;
    // 颜色 colour
    this.color = options.color || "#000000";
    this.copy = options.copy || false;
};

// 渲染图像 rendering of an image
Particle.prototype.render = function() {
    //从(0,0)开始新的路径；Start a new path from (0,0);
    this.context.beginPath();
    // 创建曲线弧 Creating curved arcs
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // 绘图的线条宽度 Line width for drawing
    this.context.lineWidth = 2;
    //颜色填充 Colour Fill
    this.context.fillStyle = this.color;
    // 填充当前图像的路径 Fill the path of the current image
    this.context.fill();
    // 返回初始点,并且绘制线条到初始位置 Returns the initial point and draws the line to the initial position.
    this.context.closePath();
};

/**
 * 粒子扩散算法 particle diffusion algorithm
 * @param R
 * @returns {boolean}
 */
Particle.prototype.spread = function(distance) {
    if (this.R < this.canvasR) {
        // 移动系数d Movement factor d
        // 距离圆心越近，扩散距离越长, 平滑移动，计算公式：移动距离 = 中心粒子移动的最远距离 * (图层半径 - 当前粒子到圆心的距离) / 图层半径 
        // The closer to the centre of the circle, the longer the spreading distance, smooth movement, calculation formula: movement distance = the furthest distance from the centre of the particle * (layer radius - distance from the current particle to the centre of the circle) / layer radius
        let d = distance * (this.canvasR - this.R) / this.canvasR;
        if (this.R + d >= this.canvasR - 2 * this.radius) {
            return true;
        }
        this.R += d;
        this.x = this.centerX + this.R * Math.cos(this.tan);
        this.y = this.centerY + this.R * Math.sin(this.tan);
    }
    // 重新绘制图像 Redraw the image
    this.render();
    return true;
};

/**
 * 粒子旋转算法 particle rotation algorithm
 * @param R
 * @returns {boolean}
 */
Particle.prototype.rotate = function(theta) {
    if (this.copy) {
        // 点(x, y)绕圆心(rx0, ry0)旋转theta弧度后的坐标(x1, y1)计算公式：Formula for the coordinates (x1, y1) of the point (x, y) after rotating theta radians around the centre of the circle (rx0, ry0):
        //x1= (x - rx0)*cos(a) - (y - ry0)*sin(a) + rx0 ;
        //y1= (x - rx0)*sin(a) + (y - ry0)*cos(a) + ry0 ;
        let x = (this.x - this.centerX) * Math.cos(theta) - (this.y - this.centerY) * Math.sin(theta) + this.centerX;
        let y = (this.x - this.centerX) * Math.sin(theta) + (this.y - this.centerY) * Math.cos(theta) + this.centerY;
        this.x = x;
        this.y = y;
    }
    // 重新绘制图像 Redraw the image
    this.render();
    return true;
};

Particle.prototype.static = function() {
    // 重新绘制图像 Redraw the image
    this.render();
    return true;
};
// 生成图片 Generate Image
let LogoImg = function(context, options){
    // 在画布里的x坐标 x-coordinate in the canvas
    this.x = options.x || 0;
    // 在画布里的y坐标 y-coordinate in the canvas
    this.y = options.y || 0;
    this.width = options.width;
    this.height = options.height;
    this.photo = new Image();
    this.photo.src = options.src;
    this.opacity = options.opacity || 0.0;
    this.context = context;
    this.copy = options.copy || false;
};
/**
 * 图片旋转 Image rotation
 * @param R
 * @returns {boolean}
 */
LogoImg.prototype.rotate = function(theta) {
    if (this.copy) {
        //this.context.clearRect(this.x, this.y, this.width, this.height);
        this.context.save();
        // 平移到矩形的中心 Pan to the centre of the rectangle
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2 );
        // 旋转坐标系 coordinate system of rotation
        this.context.rotate(theta);
        this.context.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        //this.context.fillStyle = "#EBE8D9";
        this.context.drawImage(this.photo, this.x, this.y, this.width, this.height);
        this.context.restore();
    } else {
        //this.context.clearRect(this.x, this.y, this.width, this.height);
        this.context.drawImage(this.photo, this.x, this.y, this.width, this.height);
    }
    return true;
};
LogoImg.prototype.render = function () {
    //this.context.clearRect(this.x, this.y, this.width, this.height);
    this.context.fillStyle = "#EBE8D9";
    this.context.drawImage(this.photo, this.x, this.y, this.width, this.height);
}
// 生成标题 Generate Title
let LogoTitle = function(context, options){
    // 在画布里的x坐标 x-coordinate in the canvas
    this.x = options.x || 0;
    // 在画布里的y坐标 y-coordinate in the canvas
    this.y = options.y || 0;
    this.font = options.font || "30px bolder ARLRDBD";
    this.color = options.color || "#000000";
    this.text = options.text || "";
    this.textAlign = options.textAlign || "center";
    this.textBaseline = options.textBaseline || "middle";
    this.opacity = options.opacity || 0.0;
    this.context = context;
};
LogoTitle.prototype.render = function () {
    //this.context.clearRect(this.x, this.y, this.width, this.height);
    // 设置字体 Setting fonts
    this.context.font = this.font;
    this.context.fillStyle = this.color;
    this.context.textAlign = this.textAlign;
    this.context.textBaseline = this.textBaseline;
    this.context.fillText(this.text, this.x, this.y);
}

let ParticleGraph = function (option) {
    option = option || {};
    this.num = option.num || 6500;
    this.spreads = [];
    this.rotates = [];
    this.canvasR = option.canvasR || window.innerWidth / 2;
    this.canvas = document.getElementById(option.id);
    this.canvas.width = option.width || window.innerWidth;
    this.canvas.height = option.height || window.innerHeight;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.context = this.canvas.getContext('2d');
    this.logo = {};
    this.title = {};
    this.rotateImgs = [];
    this.opacity = 1;
    this.rotated = false;
    this.fadeOuting = false;
    this.rotating = false;
    this.draging = false;
    this.clear();
}
ParticleGraph.prototype.clear = function () {
    this.context.clearRect(this.x, this.y, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#EBE8D9';
    this.context.globalAlpha = this.opacity;
    this.context.fillRect(this.x, this.x, this.canvas.width, this.canvas.height);
}

/**
 * 开始生成粒子 Start generating particles
 * @param num 粒子个数 particle count
 */
ParticleGraph.prototype.startGraph = function (num, callback) {
    this.num = num;
    this.createParticle(this.num);
    this.canvas.onclick = (e)=> {
        this.onclickTitle(e);
    }
    this.canvas.onmousemove = (e) => {
        this.mouseoverTitle(e);
    }
    if (typeof callback === "function") {
        callback();
    }
}
ParticleGraph.prototype.spread = function (distance, callback){
    if (distance < 0) {
        //console.log("扩散完成")
        if (typeof callback === "function") {
            callback();
        }
        return;
    }
    this.clear();
    let d = 6;
    distance -= d;
    //this.rotates.filter(p => p.static());
    this.spreads.filter(p => p.spread(d));
    requestAnimationFrame(() => this.spread(distance, callback));
}
ParticleGraph.prototype.rotate = function (theta, rotateTheta, callback){
    if (rotateTheta > theta) {
        // 旋转完成，修改标记 Rotation complete. Modify markings.
        this.rotated = true;
        if (typeof callback === "function") {
            callback();
        }
        return;
    }
    this.clear();
    let d = theta / 60;
    rotateTheta += d;
    //this.rotates.filter(p => p.rotate(d));
    this.spreads.forEach(p => p.static());
    this.logo.render();
    this.title.render();
    this.rotateImgs.forEach(p => p.rotate(rotateTheta));
    requestAnimationFrame(() => this.rotate(theta, rotateTheta, callback));
}

ParticleGraph.prototype.fadeInLogo = function (callback){
    // logo
    let centerRotate = getCenter(-200, -100);
    let optionRotate = {
        x: centerRotate.x,
        y: centerRotate.y,
        width: 250,
        height: 250,
        src: "images/rotate.png"
    };
    let optionRotateCopy = {
        x: centerRotate.x,
        y: centerRotate.y,
        width: 250,
        height: 250,
        src: "images/rotate.png",
        copy: true
    };
    /* 这个先后顺序不能错，先渲染旋转的图片，在渲染静止的图片，防止旋转时静止图片被擦除 The sequence can not be wrong, first render the rotating picture, in the rendering of the still picture, to prevent the still picture is erased when rotated */
    this.rotateImgs.push(new LogoImg(this.context, optionRotateCopy));
    this.rotateImgs.push(new LogoImg(this.context, optionRotate));
    let centerImg = getCenter(70, 25);
    let optionImg = {
        x: centerImg.x,
        y: centerImg.y,
        width: 160,
        height: 120,
        src: "images/logo.png"
    };
    this.logo = new LogoImg(this.context, optionImg);
    // 标题 title
    let centerText = getCenter(0, 200);
    let optionText = {
        x: centerText.x,
        y: centerText.y,
        text: "—— Gennerate disorder and order ——",
        font: "25px bolder 黑体",
        color: "#000000",
        textAlign: "center",
        textBaseline: "middle"
    };
    this.title = new LogoTitle(this.context, optionText);
    fadeIn(this, 0, callback);
}

/**
 * 淡入页面 fade in
 * @param callback
 */
function fadeIn(_this, opacity, callback) {
    if (opacity >= 1.0) {
        if (typeof callback === "function") {
            callback();
        }
        return;
    }
    _this.clear();
    // 修改淡入时间 Modify the fade-in time
    if (opacity >= 0.02) {
        opacity += 0.02;
    } else {
        opacity += 0.001;
    }
    // 绘制粒子时，设置透明度1 When drawing particles, set the transparency 1
    _this.context.globalAlpha = 1.0;
    _this.spreads.filter(p => p.static());
    // 绘制logo淡入前，设置透明度为当前值。Set the transparency to the current value before drawing the logo fade.
    _this.context.globalAlpha = opacity;
    _this.logo.render();
    _this.title.render();
    _this.rotateImgs.forEach(p => p.render());
    requestAnimationFrame(() => fadeIn(_this, opacity, callback));
}
function getCenter(offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    return {
        x: window.innerWidth / 2 + offsetX,
        y: window.innerHeight / 2 + offsetY
    }
}

/**
 * 淡出页面 fade out
 * @param duration
 */
ParticleGraph.prototype.fadeOut = function (duration, callback){
    if (this.opacity < 0) {
        this.spreads = [];
        if (typeof callback === "function") {
            callback();
        }
        return;
    }
    // 执行频率，60HZ Actuation frequency, 60 HZ
    let d = duration / 1000 * 60 ;
    let theta = 6.5 * (Math.PI / 180);
    this.opacity -= 1/d;
    this.clear();
    this.spreads.forEach(p => p.static());
    this.logo.render();
    this.title.render();
    this.rotateImgs.forEach(p => p.rotate(theta));
    requestAnimationFrame(() => this.fadeOut(duration, callback));
}

/**
 * 导出为png Export as png
 */
ParticleGraph.prototype.saveAsPNG = function (){
    let exportCanvas = document.createElement("canvas");
    exportCanvas.width = this.canvasR * 2;
    exportCanvas.height = this.canvasR * 2;
    let exportContext = exportCanvas.getContext('2d');
    exportContext.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportContext.fillStyle = 'rgba(255, 255, 255, 0)';
    exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    this.spreads.forEach(p => {
        let option1 = {
            x: p.x + this.canvasR - p.centerX,
            y: p.y + this.canvasR - p.centerY,
            radius: p.radius,
            centerX: p.centerX,
            centerY: p.centerY,
            canvasR: p.canvasR,
        }
        new Particle(exportContext, option1).static();
    });
    this.rotates.forEach(p => {
        let option2 = {
            x: p.x + this.canvasR - p.centerX,
            y: p.y + this.canvasR - p.centerY,
            radius: p.radius,
            centerX: p.centerX,
            centerY: p.centerY,
            canvasR: p.canvasR,
            copy: true
        }
        new Particle(exportContext, option2).static();
    });

    return exportCanvas.toDataURL("image/png");
}
/**
 * 点击 strike (on the keyboard)
 * @param duration
 */
ParticleGraph.prototype.onclickTitle = function (event){
    // 旋转完成标记和淡出标记 Rotating finish markers and fade-out markers
    if (!this.rotated || this.fadeOuting) {
        return;
    }
    let x = event.pageX;
    let y = event.pageY;
    let titleX = this.title.x;
    let titleY = this.title.y;
    if (x > titleX - 200 && x < titleX + 200) {
        if (y > titleY - 15 && y < titleY + 15) {
            this.fadeOuting = true;
            this.fadeOut(1000, () => {
                this.fadeOuting = false;
                this.opacity = 1;
                this.clear();
                this.num = 10000;
                this.genareteParticle(2000, () => {
                    this.copySpreadToRotate();
                    // 生成粒子后等待0.5秒，开始旋转 Wait 0.5 seconds after generating particles to start rotation
                    setTimeout(() => {
                        this.defaultToRotate(()=>{
                            //旋转完成，显示导航栏 Rotation complete, navigation bar displayed
                            let opacity = 0;
                            showNavigation();
                            function showNavigation() {
                                if (opacity >= 1) {
                                    return;
                                }
                                opacity += 0.05;
                                document.getElementById("navigation").style.opacity = opacity;
                                requestAnimationFrame(() => showNavigation());
                            }
                        });
                    }, 2000);
                    // 重新绑定点击事件 Re-bind the click event
                    this.canvas.onmousedown = (e) => {
                        this.draging = true;
                        this.rotating = false;
                        this.dragPoint = {
                            x: e.pageX,
                            y: e.pageY
                        }
                        this.canvas.onmousemove = (e) => this.dragToRotate(e);
                    };
                    this.canvas.onmouseup = (e) => {
                        this.draging = false;
                        this.rotating = false;
                        this.canvas.onmousemove = null;
                    }
                });
            });
            // 卸载事件 uninstallation event
            this.canvas.onclick = null;
            this.canvas.onmousemove = null;
            this.canvas.style.cursor = "default";
        }
    }
}
/**
 * mouseoverTitle
 * @param duration
 */
ParticleGraph.prototype.mouseoverTitle = function (event){
    let x = event.pageX;
    let y = event.pageY;
    let titleX = this.title.x;
    let titleY = this.title.y;
    if (x > titleX - 200 && x < titleX + 200) {
        if (y > titleY - 15 && y < titleY + 15) {
            this.canvas.style.cursor = "pointer";
            return;
        }
    }
    this.canvas.style.cursor = "default";
}

/**
 * mouseoverTitle
 * @param duration
 */
ParticleGraph.prototype.defaultToRotate = function (callback){
    let _this = this;
    let timesline = 6.5 * (Math.PI / 180);
    let theta = timesline / 40;
    rotatting(theta, 0);
    function rotatting(theta) {
        if (timesline <= 0) {
            if (typeof callback ==="function") {
                callback();
            }
            return;
        }
        // 60Hz
        timesline -= theta;
        _this.clear();
        _this.rotates.filter(p => p.rotate(theta));
        _this.spreads.filter(p => p.static());
        requestAnimationFrame(() => rotatting(theta));
    }
}
ParticleGraph.prototype.dragToRotate = function(event) {
    //if (!this.draging || this.rotating) {
    if (!this.draging) {
        return;
    }
    let curPoint = {
        x: event.pageX,
        y: event.pageY
    };
    let _this = this;
    let theta = calcAngle(this.dragPoint, curPoint);
    rotatting(theta, 0);
    function rotatting(theta, ii) {
        _this.clear();
        _this.rotates.filter(p => p.rotate(theta/1500));
        _this.spreads.filter(p => p.static());
        //requestAnimationFrame(() => rotatting(theta, ii));
    }
}
/**
 * 计算拖拽开始鼠标按下坐标到当前移动点的夹角 Calculates the angle between the mouse down coordinate at the start of the drag and the current move point.
 * @param point
 * @returns {number}
 */
function calcAngle(pointB, pointC) {
    let A = getCenter();//原点 origin (math.)
    let B = pointB;
    let C = pointC;
    let preAngle = Math.atan2(B.y - A.y, B.x - A.x);
    var curAngle = Math.atan2(C.y - A.y, C.x - A.x);
    var transferAngle = curAngle - preAngle;
    return transferAngle * 180 / Math.PI;
    /*
    var AB = Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
    var AC = Math.sqrt(Math.pow(A.x - C.x, 2) + Math.pow(A.y - C.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var cosA = (Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2)) / (2 * AB * AC);
    return Math.round( Math.acos(cosA) * 180 / Math.PI );
    */
}

ParticleGraph.prototype.genareteParticle = function (duration, callback){
    if (duration < 0) {
        if (callback && typeof callback === "function") {
            callback();
        }
        return;
    }
    // duration 生成粒子所需剩余秒数 Remaining seconds to generate particles
    // 执行频率 60HZ Execution frequency 60HZ
    let d = 1000 / 60;
    // 每次生成粒子数 Number of particles per generation
    let num = (this.num - this.spreads.length) * d / duration;
    duration -= d;
    this.createParticle(num);
    requestAnimationFrame(() => this.genareteParticle(duration, callback));
}
ParticleGraph.prototype.createParticle = function (num){
    let center = getCenter();
    for (let i = 0; i < num; i++) {
        let radius = getRandomRadius() / 10;
        let canvasR = this.canvasR;
        if (radius > 9) {
            canvasR *= 0.8;
        }
        if (radius > 7) {
            canvasR *= 0.85;
        }
        if (radius > 4) {
            canvasR *= 0.9;
        }
        if (radius > 1) {
            canvasR *= 0.95;
        }
        let point = randomPoint(center, canvasR);
        let option = {
            x: point.x,
            y: point.y,
            radius: radius,
            centerX: center.x,
            centerY: center.y,
            canvasR: this.canvasR
        }
        let particle = new Particle(this.context, option);
        this.spreads.push(particle);
    }
    this.spreads = this.spreads.filter(p => p.static());
}
ParticleGraph.prototype.copySpreadToRotate = function (){
    this.rotates = this.spreads.map(p => {
        let option2 = {
            x: p.x,
            y: p.y,
            radius: p.radius,
            centerX: p.centerX,
            centerY: p.centerY,
            canvasR: p.canvasR,
            copy: true
        }
        return new Particle(p.context, option2);
    });
}
function randomPoint(center, canvasR) {
    let d = Math.sqrt(Math.random()) * canvasR;
    let angle = Math.random() * 2 * Math.PI;
    return {
        x: d * Math.cos(angle) + center.x,
        y: d * Math.sin(angle) + center.y
    }
}

/**
 * 生成随机粒子算法 Algorithm for generating random particles
 * @constructor
 */
let SmoothWeightRoundRobin = function() {
    this.smoothPairs = [];
    /*权重总和 sum of weights*/
    this.weightCount = 0;
}
let SmoothPair = function (weight, curWeight, values) {
    this.weight = weight || 0;
    this.curWeight = curWeight || 0;
    this.values = values || [];
}
SmoothWeightRoundRobin.prototype.init = function() {
    let xs = new SmoothPair();
    for (let g = 2; g < 10; g++) {
        xs.values.push(g);
    }
    xs.weight = 2000;
    let s = new SmoothPair();
    for (let i = 10; i < 30; i++) {
        s.values.push(i);
    }
    s.weight = 1500;
    let m = new SmoothPair();
    for (let j = 31; j < 90; j++) {
        m.values.push(j);
    }
    m.weight = 1000;
    let l = new SmoothPair();
    for (let k = 91; k < 160; k++) {
        l.values.push(k);
    }
    l.weight = 100;
    let xl = new SmoothPair();
    for (let h = 161; h < 230; h++) {
        xl.values.push(h);
    }
    xl.weight = 10;
    this.smoothPairs.push(xs);
    this.smoothPairs.push(s);
    this.smoothPairs.push(m);
    this.smoothPairs.push(l);
    this.smoothPairs.push(xl);
    this.smoothPairs.forEach(pair => this.weightCount += pair.weight);
}
SmoothWeightRoundRobin.prototype.getPair = function () {
    let resPair = null;
    this.smoothPairs.forEach(pair => {
        pair.curWeight = pair.weight + pair.curWeight;
        if (resPair == null || resPair.curWeight < pair.curWeight){
            resPair = pair;
        }
    });
    resPair.curWeight = resPair.curWeight - this.weightCount;
    return resPair;
}
const smoothWeightRoundRobin = new SmoothWeightRoundRobin();
smoothWeightRoundRobin.init();
function getRandomRadius() {
    let pair = smoothWeightRoundRobin.getPair();
    let values = pair.values;
    return values[Math.floor(Math.random() * values.length)]
}