/**
 * Function to check if given polygon is convex
 * @param polygon {Array<Point>}
 * @return boolean
 */
const isConvex = (polygon = []) => {
    const {length} = polygon;
    let pre = 0, curr = 0;
    for (let i = 0; i < length; ++i) {
        let dx1 = polygon[(i + 1) % length][0] - polygon[i][0];
        let dx2 = polygon[(i + 2) % length][0] - polygon[(i + 1) % length][0];
        let dy1 = polygon[(i + 1) % length][1] - polygon[i][1];
        let dy2 = polygon[(i + 2) % length][1] - polygon[(i + 1) % length][1];
        curr = dx1 * dy2 - dx2 * dy1;
        if (curr !== 0) {
            if ((curr > 0 && pre < 0) || (curr < 0 && pre > 0))
                return false;
            else
                pre = curr;
        }
    }
    return true;
};

/**
 * Function to invert y coordinate
 * @param actualY {number}
 * @return number
 */
const getTranslatedY = function (actualY) {
    return innerHeight - actualY
}

/**
 * Function to generate pseudo random int value by max
 * @max is a value which maximum will be generated
 */
const getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
}

/**
 * Triangle class to determine a triangle with three dots
 */
class Triangle {
    constructor(first, second, third) {
        this.firstPoint = first
        this.secondPoint = second
        this.thirdPoint = third
    }
}

/**
 * Point class to determine a point with x and y coords
 */
class Point {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

/**
 * RegionNode class to determine a node of region tree of dots
 */
class RegionNode {
    constructor(xmin, ymin, xmax, ymax, points = []) {
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
        this.points = points;
        this.left = null;
        this.right = null;
    }
}

//Для определения, находится ли точка внутри треугольника, необходимо выполнить некоторые вычисления, которые занимают время O(1) для каждой точки.
//
// Предположим, что мы знаем координаты трех вершин треугольника и координаты точки, которую мы хотим проверить.
// Мы можем использовать формулу Герона, чтобы вычислить площадь треугольника.
// Затем мы можем вычислить площади трех треугольников, образованных точкой и каждой из сторон треугольника.
// Если сумма площадей этих трех треугольников равна площади исходного треугольника, то точка находится внутри треугольника.
// В противном случае точка находится вне треугольника.
//
// Эти вычисления занимают постоянное время для каждой точки, что дает время O(1) для определения нахождения точки в треугольнике.

/**
 * Function to check if given dot is inside given triangle
 * Returns true if given dot is inside given triangle and false is not
 * Complexity is O(1)
 * @param {Point} point to check
 * @param {Triangle} triangle to chcek
 * @return {boolean} result
 */
function isPointInTriangle(point, triangle) {

    const areaOrig = Math.abs(
        (triangle.secondPoint.x - triangle.firstPoint.x) * (triangle.thirdPoint.y - triangle.firstPoint.y) -
        (triangle.thirdPoint.x - triangle.firstPoint.x) * (triangle.secondPoint.y - triangle.firstPoint.y)
    )

    const area1 = Math.abs(
        (point.x - triangle.firstPoint.x) * (triangle.secondPoint.y - triangle.firstPoint.y) -
        (triangle.secondPoint.x - triangle.firstPoint.x) * (point.y - triangle.firstPoint.y)
    )
    const area2 = Math.abs(
        (point.x - triangle.secondPoint.x) * (triangle.thirdPoint.y - triangle.secondPoint.y) -
        (triangle.thirdPoint.x - triangle.secondPoint.x) * (point.y - triangle.secondPoint.y)
    )
    const area3 = Math.abs(
        (point.x - triangle.thirdPoint.x) * (triangle.firstPoint.y - triangle.thirdPoint.y) -
        (triangle.firstPoint.x - triangle.thirdPoint.x) * (point.y - triangle.thirdPoint.y)
    )

    return area1 + area2 + area3 === areaOrig
}

/**
 * Compare function to sort dots by x coordinate
 * @param {Point} a
 * @param {Point} b
 * @return {number} -1 if a.x > b.x, 1 if a.x > b.x, 0 if a.x == b.x
 */
function compare(a, b) {
    if (a.x < b.x) {
        return -1
    }
    if (a.x > b.x) {
        return 1
    }
    return 0
}

var maxX;
var minX;
let maxY;
let minY;

/**
 * Function to triangulate convex polygon which returns array of triangles
 * @param polygon {Array<Point>}
 * @return {Array<Triangle>}
 */
function triangulateConvexPolygon(polygon) {
    //finding maxX maxY minX minY of polygon
    maxX = polygon[0].x
    maxY = polygon[0].y
    minX = polygon[0].x
    minY = polygon[0].y
    for (let i = 0; i < polygon.length; i++) {
        if (polygon[i].x > maxX) {
            maxX = polygon[i].x
        }
        if (polygon[i].x < minX) {
            minX = polygon[i].x
        }
        if (polygon[i].y > maxY) {
            maxY = polygon[i].y
        }
        if (polygon[i].y < minY) {
            minY = polygon[i].y
        }
    }

    let polygonCenter = new Point((maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY)

    let triangles = []

    for (let i = 1; i < polygon.length; i++) {
        triangles.push(new Triangle(polygonCenter, polygon[i - 1], polygon[i]))
    }
    triangles.push(new Triangle(polygonCenter, polygon[0], polygon[polygon.length - 1]))

    return triangles
}

/**
 * Function to build region tree from array of dots
 * @param points {Array<Point>}
 * @return TreeOfDots
 */
function buildRegionTree(points) {

    const n = points.length;

    function buildTree(l, r) {
        if (l > r) {
            return null;
        }

        let xmin = Infinity,
            ymin = Infinity,
            xmax = -Infinity,
            ymax = -Infinity;

        for (let i = l; i <= r; i++) {
            xmin = Math.min(xmin, points[i].x);
            ymin = Math.min(ymin, points[i].y);
            xmax = Math.max(xmax, points[i].x);
            ymax = Math.max(ymax, points[i].y);
        }

        const node = new RegionNode(xmin, ymin, xmax, ymax, points.slice(l, r + 1));

        if (l === r) {
            return node;
        }

        const mid = Math.floor((l + r) / 2);

        node.left = buildTree(l, mid);
        node.right = buildTree(mid + 1, r);

        return node;
    }

    return buildTree(0, n - 1);

}


/**
 * Function to set up resulting array of dots which is inside given polygon
 * @param node {RegionNode}
 * @param minX {Number}
 * @param maxX {Number}
 * @param triangles {Array<Triangle>}
 */
function countPointsInRegionalTree(node, minX, maxX, triangles) {

    if (!node) {
        return null;
    }

    if (node.xmax <= minX || node.xmin >= maxX) {
        return null;
    }

    if (node.xmin >= minX && node.xmax <= maxX){

        for (let i = 0; i < node.points.length; i++) {
            dotsToCheck.push(node.points[i])
            for (let j = 0; j < triangles.length; j++) {
                if (isPointInTriangle(node.points[i], triangles[j])) {
                    dotsInside.push(node.points[i]);
                }
            }
        }
        return null
    }

    countPointsInRegionalTree(node.left, minX, maxX, triangles);
    countPointsInRegionalTree(node.right, minX, maxX, triangles);

    return node;
}

//------------------------------------------------------------------------------------------------------------//

let dots = []
let dotsToCheck = []
let dotsInside = []
let regionalTree;

/*const polygon = [
    new Point(700, 900),
    new Point(1200, 900),
    new Point(1500, 600),
    new Point(1200, 100),
    new Point(700, 100),
    new Point(400, 600),
];*/
/*const polygon = [
    new Point(200, 250),
    new Point(300, 100),
    new Point(600, 100),
    new Point(700, 250),
    new Point(700, 600),
    new Point(600, 750),
    new Point(300, 750),
    new Point(200, 600)
];*/
/*const polygon = [
    new Point(850, 100),
    new Point(1500, 450),
    new Point(1000, 900),
    new Point(400, 900),
    new Point(200, 450)
];*/
/*const polygon = [
    new Point(750, 900),
    new Point(1150, 900),
    new Point(1300, 500),
    new Point(1300, 250),
    new Point(950, 100),
    new Point(600, 250),
    new Point(600, 500),
];*/
const polygon = [
    new Point(780, 150),
    new Point(900, 250),
    new Point(1000, 500),
    new Point(900, 750),
    new Point(700, 900),
    new Point(500, 750),
    new Point(400, 500),
    new Point(500, 250),
    new Point(650, 150),
];

let triangles = triangulateConvexPolygon(polygon)

const mainBox = document.getElementById('mainBox');

const input = document.getElementById('input')

const btnGenerate = document.getElementById('gen')
const btnStartAlgorithm = document.getElementById('start')
const btnPrintCheck = document.getElementById('print-check')
const btnPrintInside = document.getElementById('print-inside')
const btnPrintAllDots = document.getElementById('print-dots')
const allDotsSpan = document.getElementById('dots')
const dotsInsideSpan = document.getElementById('dotsInside')
const dotsToCheckSpan = document.getElementById('dotsToCheck')
const btnRefresh = document.getElementById('refresh')

const drawPolygon = function (polygon) {
    //draw last line of polygon
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', polygon[polygon.length - 1].x)
    line.setAttribute('y1', getTranslatedY(polygon[polygon.length - 1].y))
    line.setAttribute('x2', polygon[0].x)
    line.setAttribute('y2', getTranslatedY(polygon[0].y))
    line.setAttribute('class', 'black-line')
    mainBox.append(line)
    for (let i = 0; i < polygon.length - 1; i++) {
        // Create svg line element
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // Set coords of 1st and 2nd dots between line
        line.setAttribute('x1', polygon[i].x)
        line.setAttribute('x2', polygon[i + 1].x)
        line.setAttribute('y1', getTranslatedY(polygon[i].y))
        line.setAttribute('y2', getTranslatedY(polygon[i + 1].y))
        // Add line style class
        line.setAttribute('class', 'black-line')
        // Append line element to main container
        mainBox.append(line)
    }
}
const generateDots = function (n, callback) {
    for (let i = 0; i < n; i++) {
        let point = new Point(getRandomInt(innerWidth - 300), getRandomInt(innerHeight), i)
        dots.push(point)
    }
    if (typeof callback == "function")
        callback();
}
const drawDots = function (dots, color, radius) {
    for (let i = 0; i < dots.length; i++) {
        // Create dot element which is svg 'circle'
        let dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        // Add dot x and y attr
        dot.setAttribute('cx', dots[i].x)
        dot.setAttribute('cy', getTranslatedY(dots[i].y))
        // Set radius attr
        dot.setAttribute('r', radius)
        // Set id attr
        dot.setAttribute('id', dots[i].id)
        // Set style fill
        dot.setAttribute('fill', color)
        // Append dot to main container element
        mainBox.append(dot)
    }
}

btnGenerate.onclick = function () {

    btnGenerate.style.display = 'none'
    input.style.display = 'none'

    if (input.value && isConvex(polygon)) {
        mainBox.style.width = '100%'
        mainBox.style.height = '100%'
        mainBox.style.display = 'block'
        drawPolygon(polygon)

        generateDots(input.value, () => {
            dots.sort(compare)
            regionalTree = buildRegionTree(dots)
            allDotsSpan.innerText = dots.length
        })
    }

}

btnStartAlgorithm.onclick = function () {

    btnPrintAllDots.style.display = 'block'
    btnPrintInside.style.display = 'block'
    btnPrintCheck.style.display = 'block'
    btnStartAlgorithm.style.display = 'none'
    for (let i = 0; i < document.getElementsByClassName('dots').length; i++) {
        document.getElementsByClassName('dots').item(i).style.display = 'block'
    }
    let prev = Date.now()
    countPointsInRegionalTree(regionalTree, minX, maxX, triangles)
    let post = Date.now()

    document.getElementById('time').innerText = post-prev + ' ms'
    dotsInsideSpan.innerText = dotsInside.length
    console.log(dotsToCheck.length)
    dotsToCheckSpan.innerText = dotsToCheck.length
    console.log(dotsInside)
}

btnPrintAllDots.onclick = function (){
    drawDots(dots, 'red', 1)
    btnPrintAllDots.style.display = 'none'
}

btnPrintCheck.onclick = function () {

    for (let i = 0; i < dotsToCheck.length; i++) {
        let point = document.getElementById(dotsToCheck[i].id)
        point.setAttribute('fill', 'blue')
        point.setAttribute('r', 1)
    }
}

btnPrintInside.onclick = function () {

    for (let i = 0; i < dotsInside.length; i++) {
        let point = document.getElementById(dotsInside[i].id)
        point.setAttribute('fill', 'green')
        point.setAttribute('r', 1.5)
    }
}

btnRefresh.onclick = function () {

    input.style.display = 'block'
    btnGenerate.style.display = 'block'
    btnStartAlgorithm.style.display = 'block'
    allDotsSpan.innerText = 0
    dotsToCheckSpan.innerText = 0
    dotsInsideSpan.innerText = 0
    btnPrintInside.style.display = 'none'
    btnPrintCheck.style.display = 'none'

    for (let i = 0; i < document.getElementsByClassName('dots').length; i++) {
        document.getElementsByClassName('dots').item(i).style.display = 'none'
    }

    dots = []
    dotsToCheck = []
    dotsInside = []
    regionalTree = []
    triangles = triangulateConvexPolygon(polygon)

    mainBox.innerHTML = ''

}








