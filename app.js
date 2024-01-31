class Point {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    extractRGB() {
        // Remove os caracteres "rgb(" e ")" da string
        const values = this.color.substring(4, this.color.length - 1).split(', ');
    
        // Converte os valores para números inteiros
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
    
        return { r, g, b };
    }
    rgbToHex(r, g, b) {
        // Converte os valores para formato hexadecimal e os concatena
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');
    
        // Retorna a string hexadecimal completa
        return `#${hexR}${hexG}${hexB}`;
    }
}

class Poly {
    constructor() {
        this.name = "";
        this.vertices = [];
        this.Edge = "rgb(0, 0, 0)";
    }

    sortVerticesByY() {
        this.vertices.sort((a, b) => b.y - a.y);
    }
    extractRGB() {
        // Remove os caracteres "rgb(" e ")" da string
        const values = this.Edge.substring(4, this.Edge.length - 1).split(', ');
    
        // Converte os valores para números inteiros
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
    
        return { r, g, b };
    }
}

let count = 0;
let listaPoly = [];
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

if (!context) {
    // Lida com a situação em que o contexto não está disponível
    throw new Error('Não foi possível obter o contexto 2D do canvas.');
}

const windowWidth = window.innerWidth * 0.75;
const windowHeight = window.innerHeight * 0.75;
canvas.width = windowWidth;
canvas.height = windowHeight;

let currentPoly = new Poly();

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    const currentPoint = new Point(
        event.clientX - rect.left,
        event.clientY - rect.top,
        `rgb(${red}, ${green}, ${blue})`
    );

    currentPoly.vertices.push(currentPoint);
    // Desenha os vértices para o polígono atual
    for (const vertex of currentPoly.vertices) {
        context.beginPath();
        context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        context.fillStyle = vertex.color;
        context.fill();
        context.strokeStyle = currentPoly.Edge;
        context.stroke();
    }
    // Desenha o polígono atual se houverem três vértices presentes
    if (currentPoly.vertices.length === 3) {
        drawTriangle(context, currentPoly.vertices, currentPoly.Edge);
        currentPoly.name = "T" + count++;
        currentPoly.sortVerticesByY();
        listaPoly.push(currentPoly);
        console.log("TEste 1")
        console.log('Triangle:', currentPoly.vertices[0].extractRGB().r);
        currentPoly = new Poly();
        updateTriangleTable();
        redrawCanvas(context);
    }
});

function drawTriangle(ctx, vertices, edge) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(vertices[0].x, vertices[0].y);

    for (let i = 1; i < 3; i++) {
        
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = edge;
    ctx.stroke();
}

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    listaPoly.length = 0;
    count = 0;
    updateTriangleTable()
}

function updateTriangleTable() {
    const triangleTable = document.getElementById('triangleTable');

    while (triangleTable.rows.length > 1) {
        triangleTable.deleteRow(1);
    }

    listaPoly.forEach((triangle, index) => {
        const newRow = triangleTable.insertRow();

        const idCell = newRow.insertCell(0);
        const vertex1Cell = newRow.insertCell(1);
        const vertex2Cell = newRow.insertCell(2);
        const vertex3Cell = newRow.insertCell(3);
        const edgeCell = newRow.insertCell(4);
        const actionsCell = newRow.insertCell(5);

        idCell.textContent = triangle.name;

        const createColorInput = (value, onchange) => {
            console.log('value')
            console.log(value)
            const hexColor = rgbToHex(parseInt(value.r), parseInt(value.g), parseInt(value.b))
            const input = document.createElement('input');
            input.type = 'color';
            input.value = hexColor;
            input.addEventListener('input', onchange);
            return input;
        };
        // console.log(triangle.vertices[0].color)
        vertex1Cell.appendChild(createColorInput(triangle.vertices[0].extractRGB(), (event) => handleColorChange(index, 0, 'vertex', event)));
        vertex2Cell.appendChild(createColorInput(triangle.vertices[1].extractRGB(), (event) => handleColorChange(index, 1, 'vertex', event)));
        vertex3Cell.appendChild(createColorInput(triangle.vertices[2].extractRGB(), (event) => handleColorChange(index, 2, 'vertex', event)));
        console.log('aqui')
        console.log(triangle.Edge)
        edgeCell.appendChild(createColorInput(triangle.extractRGB(), (event) => handleColorChange(index, null, 'edge', event)));

        actionsCell.innerHTML = `<button onclick="deleteTriangle(${index})">Delete</button>`;
    });
}

function rgbToHex(r, g, b) {
    const toHex = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);

    return `#${hexR}${hexG}${hexB}`;
}

function handleColorChange(index, vertexIndex, type, event) {
    const colorPicker = event.target;
    const hexColor = colorPicker.value;
    const rgbColor = hexToRgb(hexColor);

    console.log('RGB Color:', rgbColor);

    if (type === 'vertex') {
        // Mudança de cor para um vértice específico
        const vertices = listaPoly[index].vertices;
        vertices[vertexIndex].color = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        redrawCanvas(context);
    } else if (type === 'edge') {
        // Mudança de cor para a borda do polígono
        listaPoly[index].Edge = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        redrawCanvas(context);
    }
    updateTriangleTable();
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
}

function redrawCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    listaPoly.forEach((triangle) => {
        console.log('Triangle:', triangle); 
        console.log('R:', triangle.vertices[0].extractRGB().r);
        console.log('G:', triangle.vertices[0].extractRGB().g);
        console.log('B:', triangle.vertices[0].extractRGB().b); 
        drawTriangle(context, triangle.vertices, triangle.Edge);

        // Redesenha os vértices
        for (let i = 0; i < triangle.vertices.length; i++) {
            const vertex = triangle.vertices[i];

            context.beginPath();
            context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            context.fillStyle = vertex.color;
            context.fill();
            context.strokeStyle = triangle.Edge;
            context.stroke();
        }
        fillPoly(triangle, context);
    });
}

function deleteTriangle(index) {
    // Remove o polígono da lista pelo índice
    listaPoly.splice(index, 1);

    // Redesenha o canvas com as novas informações
    redrawCanvas(context);

    // Atualiza a tabela com as novas informações
    updateTriangleTable();
}

function fillPoly(poly, ctx) {
    // Cria um mapa para armazenar as interseções em cada coordenada y
    let intersections = new Map();

    const minY = Math.min(poly.vertices[0].y, poly.vertices[1].y, poly.vertices[2].y);
    const maxY = Math.max(poly.vertices[0].y, poly.vertices[1].y, poly.vertices[2].y);

    // Inicializa o mapa com arrays vazios para cada coordenada y entre os vértices
    for (let y = minY; y < maxY; y++) {
        intersections.set(y, []);
    }

    // Define as arestas do polígono
    let edges = [
        { start: poly.vertices[0], end: poly.vertices[1], rate: (poly.vertices[1].x - poly.vertices[0].x) / (poly.vertices[1].y - poly.vertices[0].y) },
        { start: poly.vertices[1], end: poly.vertices[2], rate: (poly.vertices[2].x - poly.vertices[1].x) / (poly.vertices[2].y - poly.vertices[1].y) },
        { start: poly.vertices[2], end: poly.vertices[0], rate: (poly.vertices[0].x - poly.vertices[2].x) / (poly.vertices[0].y - poly.vertices[2].y) }
    ];

    let edgesRGB = [
        {
            rateR: ((poly.vertices[1].extractRGB().r - poly.vertices[0].extractRGB().r) / (poly.vertices[1].y - poly.vertices[0].y)),
            rateG: ((poly.vertices[1].extractRGB().g - poly.vertices[0].extractRGB().g) / (poly.vertices[1].y - poly.vertices[0].y)),
            rateB: ((poly.vertices[1].extractRGB().b - poly.vertices[0].extractRGB().b) / (poly.vertices[1].y - poly.vertices[0].y))
        },
        {
            rateR: ((poly.vertices[2].extractRGB().r - poly.vertices[1].extractRGB().r) / (poly.vertices[2].y - poly.vertices[1].y)),
            rateG: ((poly.vertices[2].extractRGB().g - poly.vertices[1].extractRGB().g) / (poly.vertices[2].y - poly.vertices[1].y)),
            rateB: ((poly.vertices[2].extractRGB().b - poly.vertices[1].extractRGB().b) / (poly.vertices[2].y - poly.vertices[1].y))
        },
        {
            rateR: ((poly.vertices[0].extractRGB().r - poly.vertices[2].extractRGB().r) / (poly.vertices[0].y - poly.vertices[2].y)),
            rateG: ((poly.vertices[0].extractRGB().g - poly.vertices[2].extractRGB().g) / (poly.vertices[0].y - poly.vertices[2].y)),
            rateB: ((poly.vertices[0].extractRGB().b - poly.vertices[2].extractRGB().b) / (poly.vertices[0].y - poly.vertices[2].y))
        }
    ];

    // Preenche o mapa de interseções para cada aresta
    for (let i = 0; i < 3; i++) {
        let initialY, endY, currentX, currentR, currentG, currentB;

        if (edges[i].start.y < edges[i].end.y) {
            initialY = edges[i].start.y;
            endY = edges[i].end.y;
            currentX = edges[i].start.x;
            currentR = edges[i].start.extractRGB().r;
            currentG = edges[i].start.extractRGB().g;
            currentB = edges[i].start.extractRGB().b;
        } else {
            initialY = edges[i].end.y;
            endY = edges[i].start.y;
            currentX = edges[i].end.x;
            currentR = edges[i].end.extractRGB().r;
            currentG = edges[i].end.extractRGB().g;
            currentB = edges[i].end.extractRGB().b;
        }

        for (let y = initialY; y < endY; y++) {
            intersections.get(y).push({ x: currentX, r: currentR, g: currentG, b: currentB });
            currentX += edges[i].rate;
            currentR += edgesRGB[i].rateR;
            currentG += edgesRGB[i].rateG;
            currentB += edgesRGB[i].rateB;
        }
    }

    // Ordena as interseções em cada linha de varredura
    intersections.forEach((sortX) => {
        // Create a new array with sorted values
        const sortedX = sortX.slice().sort((a, b) => a.x - b.x);

        // Replace the original array with the sorted values
        sortX.splice(0, sortX.length, ...sortedX);
    });

    // Preenche o polígono usando as interseções
    for (let currentY = minY; currentY < maxY; currentY++) {
        let edge = intersections.get(currentY);
    
        for (let i = 0; i < edge.length; i += 2) {
            let initialX = edge[i].x;
            let endX = edge[i + 1].x;
            let currentR = edge[i].r;
            let currentG = edge[i].g;
            let currentB = edge[i].b;
    
            const variationR = (edge[i + 1].r - edge[i].r) / (endX - initialX);
            const variationG = (edge[i + 1].g - edge[i].g) / (endX - initialX);
            const variationB = (edge[i + 1].b - edge[i].b) / (endX - initialX);
    
            for (let currentX = initialX; currentX < endX; currentX++) {
                ctx.fillStyle = `rgb(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)})`;
                ctx.fillRect(currentX, currentY, 1, 1);
                currentR += variationR;
                currentG += variationG;
                currentB += variationB;
            }
        }
    }
}