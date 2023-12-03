"use strict";
class Point {
    constructor(x, y, color, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
    }
}
function generateUniqueId() {
    return 'triangle_' + Date.now();
}
function drawTriangle(context, vertices) {
    if (!context) {
        console.error('Contexto não disponível.');
        return;
    }
    if (vertices.length !== 3) {
        console.error('Número inválido de vértices. O triângulo precisa de exatamente 3 vértices.');
        return;
    }
    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < 3; i++) {
        context.lineTo(vertices[i].x, vertices[i].y);
    }
    context.closePath();
    context.stroke();
}
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
if (!context) {
    throw new Error('Não foi possível obter o contexto 2D do canvas.');
}
const windowWidth = window.innerWidth * 0.75;
const windowHeight = window.innerHeight * 0.75;
canvas.width = windowWidth;
canvas.height = windowHeight;
const triangles = [];
let currentVertices = [];
let isDrawing = false;
const colorPicker = document.getElementById('colorPicker');
function updateTriangleTable() {
    const triangleTable = document.getElementById('triangleTable');
    while (triangleTable.rows.length > 1) {
        triangleTable.deleteRow(1);
    }
    for (const vertices of triangles) {
        const triangleId = vertices[0].id;
        const row = triangleTable.insertRow();
        const cellId = row.insertCell(0);
        cellId.innerHTML = triangleId;
        for (let i = 0; i < 3; i++) {
            const cellColor = row.insertCell(i + 1);
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = vertices[i].color;
            colorPicker.addEventListener('input', (event) => handleColorChange(triangleId, i, event));
            cellColor.appendChild(colorPicker);
        }
        const cellDelete = row.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', () => deleteTriangle(triangleId));
        cellDelete.appendChild(deleteButton);
    }
}
function handleColorChange(triangleId, vertexIndex, event) {
    const colorPicker = event.target;
    const color = colorPicker.value;
    const index = triangles.findIndex(triangle => triangle[0].id === triangleId);
    if (index !== -1) {
        const vertices = triangles[index];
        vertices[vertexIndex].color = color;
        updateTriangleTable();
        clearTriangleFromCanvas(vertices);
        drawTriangle(context, vertices);
    }
}
function clearTriangleFromCanvas(vertices) {
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const triVertices of triangles) {
            drawTriangle(context, triVertices);
            for (const vertex of triVertices) {
                context.beginPath();
                context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
                context.fillStyle = vertex.color;
                context.fill();
                context.stroke();
            }
        }
    }
}
function deleteTriangle(triangleId) {
    let index = -1;
    for (let i = 0; i < triangles.length; i++) {
        if (triangles[i][0].id === triangleId) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        const deletedTriangle = triangles[index];
        triangles.splice(index, 1);
        updateTriangleTable();
        clearTriangleFromCanvas(deletedTriangle);
    }
}
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);
function clearCanvas() {
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    triangles.length = 0;
    currentVertices = [];
    updateTriangleTable();
}
function editTriangle(triangleId) {
    let index = -1;
    for (let i = 0; i < triangles.length; i++) {
        if (triangles[i][0].id === triangleId) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        const vertices = triangles[index];
        for (let i = 0; i < vertices.length; i++) {
            const newColor = prompt(`Enter new color for vertex ${i + 1}:`, vertices[i].color);
            if (newColor !== null) {
                vertices[i].color = newColor;
            }
        }
        updateTriangleTable();
        clearTriangleFromCanvas(vertices);
        drawTriangle(context, vertices);
    }
}
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const pointColor = colorPicker.value;
    const pointId = generateUniqueId();
    currentVertices.push({ x: mouseX, y: mouseY, color: pointColor, id: pointId });
    for (const vertices of triangles) {
        drawTriangle(context, vertices);
    }
    for (const vertex of currentVertices) {
        if (context) {
            context.beginPath();
            context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            context.fillStyle = vertex.color;
            context.fill();
            context.stroke();
        }
    }
    if (currentVertices.length === 3) {
        drawTriangle(context, currentVertices);
        triangles.push(currentVertices);
        currentVertices = [];
        updateTriangleTable();
    }
});
