var zengzong = [];
var xc = [];
var yc = [];
var mousex = [];
var mousey = [];
let b = [0];
let iz = [];
let size = [];
let dom = [30];
let lr = [];
let lg = [];
let lb = [];
let c = [];
let zeng = [];

var num = 60;
var x = [];
var y = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("backend");

    lr[0] = random(0, 100);
    lg[0] = random(0, 100);
    lb[0] = random(0, 100);
    c[0] = [];
    zeng[0] = [];
    xc[0] = [];
    yc[0] = [];
    for (let i = 0; i < 100; i++) {
        c[0][i] = -100;
        zeng[0][i] = random(0.1, 0.3);
        xc[0][i] = random(-30, 30);
        yc[0][i] = random(-30, 30);
    }
    zengzong.push(zeng[0]);
    for (var i = 0; i < num; i++) {
        x[i] = 0;
        y[i] = 0;
    }
}

function draw() {
    background("#343434");

    juntuan(width / 2, height / 2, 50, b[0], dom[0]);

    if (iz.length != 0) {
        for (let a = 0; a <= iz.length - 1; a++) {
            juntuan(mousex[a], mousey[a], size[a], b[a + 1], dom[a + 1]);
        }
    }
}

function juntuan(x, y, n, br, dr) {
    push();
    noStroke();
    translate(x, y);

    let localGray = [];
    for (let i = 0; i < n; i++) {
        localGray[i] = color(map(i, 0, n, 40, 125));
        let r = red(localGray[i]);
        let g = green(localGray[i]);
        let b = blue(localGray[i]);
        r = constrain(r + lr[br], 0, 255);
        g = constrain(g + lg[br], 0, 255);
        b = constrain(b + lb[br], 0, 255);
        fill(r, g, b);

        if (c[br][i] == -100) {
            xc[br][i] = random(-dr, dr);
            yc[br][i] = random(-dr, dr);
            c[br][i] = 11;
        } else if (c[br][i] > 10 && c[br][i] < dr + 20) {
            circle(xc[br][i], yc[br][i], c[br][i]);
            c[br][i] += zengzong[br][i];
        } else if (c[br][i] > dr + 20 || c[br][i] < 10) {
            zengzong[br][i] *= -1;
            circle(xc[br][i], yc[br][i], c[br][i]);
            c[br][i] += zengzong[br][i];
        }
    }
    pop();
}

function mousePressed() {
    let newC = [];
    let newZeng = [];
    let newXc = [];
    let newYc = [];

    for (let i = 0; i < 100; i++) {
        newC[i] = -100;
        newZeng[i] = random(0.3, 0.5);
        newXc[i] = random(-30, 30);
        newYc[i] = random(-30, 30);
    }

    mousex.push(mouseX);
    mousey.push(mouseY);
    iz.push(b);
    size.push(random(30, 50));

    zengzong.push(newZeng);
    c.push(newC);
    xc.push(newXc);
    yc.push(newYc);

    b.push(b.length);
    dom.push(random(10, 30));

    lr.push(random(0, 100));
    lg.push(random(0, 100));
    lb.push(random(0, 100));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
