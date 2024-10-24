let zengzong = [];
let xc = [];
let yc = [];
let mousex = [];
let mousey = [];
let size = [];
let dom = [30];
let paths = [];
let maxBranches = 2;
let c = [];
let zeng = [];
let maxParticles = 100;  // 限制每个菌团的粒子数量
let maxJuntuan = 50;     // 限制菌团数量


function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    frameRate(30);  // 降低帧率来平衡性能

    // 初始化第一个菌团
    initJuntuan(0, width / 2, height / 2, 50, random(10, 30));
}

function draw() {
    //Background
    background("#e5d9cc");
    for (let x = -width / 2; x < width + 20; x += 10) {
        for (let y = -height / 2; y < height; y += 10) {
            noStroke();
            ro = noise(x * y);
            bo = noise(x * y * 2);
            go = noise(x * y * 5);
            r = map(ro, 0, 1, 150, 200);
            b = map(bo, 0, 1, 150, 200);
            g = map(go, 0, 1, 200, 255);
            fill(g, r, b);
            circle(x, y, 30);
        }
    }
    rectMode(CENTER)
    fill(231, 221, 140, 200)
    rect(width / 2, height / 2, width, height)

    //if (mouseIsPressed==true) {console.log(mouseX,mouseY)}

    // 逐帧绘制路径
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].t < 1) {
            paths[i].t += 0.002;
        }
        drawBranch(paths[i]);
    }

    // 绘制所有菌团
    for (let a = 0; a < mousex.length; a++) {
        juntuan(mousex[a], mousey[a], size[a], a, dom[a]);
    }

    // 控制菌团总量
    if (mousex.length > maxJuntuan) {
        mousex.shift();
        mousey.shift();
        size.shift();
        dom.shift();
        zengzong.shift();
        c.shift();
        xc.shift();
        yc.shift();
    }
}

function drawBranch(path) {
    let totalPoints = 200;
    let amplitude = 20;

    // 计算每个点的位置
    for (let i = 0; i < totalPoints; i++) {
        let t = map(i, 0, totalPoints, 0, path.t);
        let x = lerp(path.start.x, path.end.x, t);
        let y = lerp(path.start.y, path.end.y, t);

        // 正弦波偏移
        y += sin(TWO_PI * t * 4) * amplitude * (1 - t);

        // 灰度渐变颜色
        let branchColor = lerpColor(color('#7e3f3f'), color('#f0dfc8'), t);
        fill(branchColor);
        noStroke();

        // 画圆形路径
        let branchSize = lerp(path.startDom, path.endDom, t) * 0.5;
        circle(x, y, branchSize);
    }
}

function juntuan(x, y, n, br, dr) {
    if (!c[br]) initJuntuan(br, x, y, n, dr);

    push();
    noStroke();
    translate(x, y);

    // 绘制每个菌团的粒子
    for (let i = 0; i < n; i++) {
        let localColor = color(map(i, 0, n, 40, 225));
        fill(red(localColor) + 100, green(localColor) + 30, blue(localColor));

        if (c[br][i] == -100) {
            xc[br][i] = random(-dr, dr);
            yc[br][i] = random(-dr, dr);
            c[br][i] = 11;
        } else {
            circle(xc[br][i], yc[br][i], c[br][i]);
            c[br][i] += zengzong[br][i];

            if (c[br][i] > dr + 20 || c[br][i] < 10) {
                zengzong[br][i] *= -1;
            }
        }
    }
    pop();
}

function initJuntuan(br, x, y, n, dr) {
    c[br] = Array(maxParticles).fill(-100);
    zeng[br] = Array.from({ length: maxParticles }, () => random(0.3, 0.5));
    xc[br] = Array.from({ length: maxParticles }, () => random(-30, 30));
    yc[br] = Array.from({ length: maxParticles }, () => random(-30, 30));
    zengzong.push(zeng[br]);

    mousex.push(x);
    mousey.push(y);
    size.push(n);
    dom.push(dr);
}

function mousePressed() {
    // 控制菌团数量
    if (mousex.length >= maxJuntuan) return;

    let newX = mouseX;
    let newY = mouseY;
    let newSize = random(30, 50);
    let newDom = random(10, 30);

    initJuntuan(mousex.length, newX, newY, newSize, newDom);

    // 控制分支数量
    let branchCount = floor(random(1, maxBranches + 1));
    for (let i = 0; i < branchCount; i++) {
        let targetIndex = floor(random(0, mousex.length - 1));
        if (targetIndex !== mousex.length - 1) {
            paths.push({
                start: { x: newX, y: newY },
                end: { x: mousex[targetIndex], y: mousey[targetIndex] },
                startDom: newDom,
                endDom: dom[targetIndex],
                t: 0
            });
        }
    }
}