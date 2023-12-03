// Define a Point class to represent vertices
var Point = /** @class */ (function () {
    function Point(x, y, color, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
    }
    return Point;
}());
// Função para gerar IDs únicos
function generateUniqueId() {
    return 'triangle_' + Date.now();
}
// Função para desenhar um triângulo no canvas
function drawTriangle(context, vertices) {
    if (!context) {
        console.error('Contexto não disponível.');
        return;
    }
    if (vertices.length !== 3) {
        console.error('Número inválido de vértices. O triângulo precisa de exatamente 3 vértices.');
        return;
    }
    // Move para o primeiro vértice
    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);
    // Desenha linhas para os outros vértices
    for (var i = 1; i < 3; i++) {
        context.lineTo(vertices[i].x, vertices[i].y);
    }
    // Fecha o caminho para formar um triângulo
    context.closePath();
    // Traça o caminho para realmente desenhá-lo
    context.stroke();
}
// Obtém o elemento canvas e seu contexto de renderização 2D
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
if (!context) {
    // Lida com a situação em que o contexto não está disponível
    throw new Error('Não foi possível obter o contexto 2D do canvas.');
}
var windowWidth = window.innerWidth * 0.75;
var windowHeight = window.innerHeight * 0.75;
canvas.width = windowWidth;
canvas.height = windowHeight;
// Array para armazenar vértices para cada triângulo
var triangles = [];
var currentVertices = [];
var isDrawing = false;
// Obtém o elemento colorPicker
var colorPicker = document.getElementById('colorPicker');
function updateTriangleTable() {
    var triangleTable = document.getElementById('triangleTable');
    // Limpa a tabela, mantendo o cabeçalho
    while (triangleTable.rows.length > 1) {
        triangleTable.deleteRow(1);
    }
    var _loop_1 = function (vertices) {
        var triangleId = vertices[0].id;
        var row = triangleTable.insertRow();
        // Cria a célula para o ID do triângulo
        var cellId = row.insertCell(0);
        cellId.innerHTML = triangleId;
        var _loop_2 = function (i) {
            var cellColor = row.insertCell(i + 1);
            var colorPicker_1 = document.createElement('input');
            colorPicker_1.type = 'color';
            colorPicker_1.value = vertices[i].color;
            colorPicker_1.addEventListener('input', function (event) { return handleColorChange(triangleId, i, event); });
            cellColor.appendChild(colorPicker_1);
        };
        // Cria as células para os color pickers dos vértices
        for (var i = 0; i < 3; i++) {
            _loop_2(i);
        }
        // Cria a célula para o botão "Delete"
        var cellDelete = row.insertCell(4);
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', function () { return deleteTriangle(triangleId); });
        cellDelete.appendChild(deleteButton);
    };
    // Adiciona cada triângulo à tabela
    for (var _i = 0, triangles_1 = triangles; _i < triangles_1.length; _i++) {
        var vertices = triangles_1[_i];
        _loop_1(vertices);
    }
}
// Função para tratar a alteração de cor de um vértice
function handleColorChange(triangleId, vertexIndex, event) {
    var colorPicker = event.target;
    var color = colorPicker.value;
    var index = triangles.findIndex(function (triangle) { return triangle[0].id === triangleId; });
    if (index !== -1) {
        var vertices = triangles[index];
        vertices[vertexIndex].color = color;
        // Atualiza a tabela e redesenha o canvas
        updateTriangleTable();
        clearTriangleFromCanvas(vertices);
        drawTriangle(context, vertices);
    }
}
function clearTriangleFromCanvas(vertices) {
    // Limpa apenas o triângulo especificado
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Redesenha os triângulos restantes
        for (var _i = 0, triangles_2 = triangles; _i < triangles_2.length; _i++) {
            var triVertices = triangles_2[_i];
            drawTriangle(context, triVertices);
            // Redesenha os pontos dos triângulos restantes
            for (var _a = 0, triVertices_1 = triVertices; _a < triVertices_1.length; _a++) {
                var vertex = triVertices_1[_a];
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
    // Encontra e remove o triângulo com o ID correspondente
    var index = -1;
    for (var i = 0; i < triangles.length; i++) {
        if (triangles[i][0].id === triangleId) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        var deletedTriangle = triangles[index];
        triangles.splice(index, 1);
        updateTriangleTable();
        clearTriangleFromCanvas(deletedTriangle);
    }
}
// Event listener para o botão de limpar
var clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);
// Função para limpar o canvas
function clearCanvas() {
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    triangles.length = 0; // Limpa o array de triângulos
    currentVertices = [];
    updateTriangleTable();
}
function editTriangle(triangleId) {
    var index = -1;
    // Procura o índice do triângulo com o ID correspondente
    for (var i = 0; i < triangles.length; i++) {
        if (triangles[i][0].id === triangleId) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        var vertices = triangles[index];
        // Pede ao usuário para inserir uma nova cor para cada vértice
        for (var i = 0; i < vertices.length; i++) {
            var newColor = prompt("Enter new color for vertex ".concat(i + 1, ":"), vertices[i].color);
            if (newColor !== null) {
                vertices[i].color = newColor;
            }
        }
        // Atualiza a tabela e redesenha o canvas
        updateTriangleTable();
        clearTriangleFromCanvas(vertices);
        drawTriangle(context, vertices);
    }
}
// Event listener para cliques do mouse no canvas
canvas.addEventListener('click', function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    // Usa a cor selecionada
    var pointColor = colorPicker.value;
    // Adiciona o ponto clicado com sua cor ao array currentVertices
    var pointId = generateUniqueId();
    currentVertices.push({ x: mouseX, y: mouseY, color: pointColor, id: pointId });
    // Desenha todos os triângulos armazenados
    for (var _i = 0, triangles_3 = triangles; _i < triangles_3.length; _i++) {
        var vertices = triangles_3[_i];
        drawTriangle(context, vertices);
    }
    // Desenha os vértices para o triângulo atual
    for (var _a = 0, currentVertices_1 = currentVertices; _a < currentVertices_1.length; _a++) {
        var vertex = currentVertices_1[_a];
        if (context) {
            context.beginPath();
            context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            // Usa a cor associada ao ponto
            context.fillStyle = vertex.color;
            context.fill();
            context.stroke();
        }
    }
    // Desenha o triângulo atual se houverem três vértices presentes
    if (currentVertices.length === 3) {
        drawTriangle(context, currentVertices);
        triangles.push(currentVertices);
        currentVertices = [];
        updateTriangleTable();
    }
});
