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
let maxParticles = 100;
let maxJuntuan = 50;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    frameRate(30);

    // Preparing for the default mold which will appear at the center
    initJuntuan(0, width / 2, height / 2, 50, random(10, 30));
}

//Actual drawing
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
    rectMode(CENTER);
    fill(231, 221, 140, 200);
    rect(width / 2, height / 2, width, height);

    //if (mouseIsPressed==true) {console.log(mouseX,mouseY)}

    //Drawing the main objects

    // The climbing branches
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].t < 1) {
            paths[i].t += 0.002; //Climbing
        }
        drawBranch(paths[i]);
    }

    // Drawing all the molds
    for (let a = 0; a < mousex.length; a++) {
        juntuan(mousex[a], mousey[a], size[a], a, dom[a]);
    }

    // Control the total amount of molds
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

//Necessary functions the draw{} function will use:

//Creating the path of the branches
function drawBranch(path) {
    let totalPoints = 200;
    let amplitude = 20;

    // Calculating the positions of every point
    for (let i = 0; i < totalPoints; i++) {
        let t = map(i, 0, totalPoints, 0, path.t);
        let x = lerp(path.start.x, path.end.x, t);
        let y = lerp(path.start.y, path.end.y, t);

        // Sin-pattern
        y += sin(TWO_PI * t * 4) * amplitude * (1 - t);

        //Color of the brances slightly changing
        let branchColor = lerpColor(color("#7e3f3f"), color("#f0dfc8"), t);
        fill(branchColor);
        noStroke();

        // Drawing the circles of the branches
        let branchSize = lerp(path.startDom, path.endDom, t) * 0.5;
        circle(x, y, branchSize);
    }
}

// Drawing the mold according to the data
function juntuan(x, y, n, br, dr) {
    if (!c[br]) initJuntuan(br, x, y, n, dr);

    push();
    noStroke();
    translate(x, y);

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

//Initialize Juntuan (Creating data of a new pile of mold)
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

//When the mouse is pressed, add new data to the arrays
function mousePressed() {
    if (mousex.length >= maxJuntuan) return;

    let newX = mouseX;
    let newY = mouseY;
    let newSize = random(30, 50);
    let newDom = random(10, 30);

    initJuntuan(mousex.length, newX, newY, newSize, newDom);

    // Control numbers of the branches
    let branchCount = floor(random(1, maxBranches + 1));
    for (let i = 0; i < branchCount; i++) {
        let targetIndex = floor(random(0, mousex.length - 1));
        if (targetIndex !== mousex.length - 1) {
            paths.push({
                start: { x: newX, y: newY },
                end: { x: mousex[targetIndex], y: mousey[targetIndex] },
                startDom: newDom,
                endDom: dom[targetIndex],
                t: 0,
            });
        }
    }
}
