// Define a Point class to represent vertices
class Point {
  constructor(public x: number, public y: number, public color: string, public id: string) {}
}

// Função para gerar IDs únicos
function generateUniqueId() {
  return 'triangle_' + Date.now();
}

// Função para desenhar um triângulo no canvas
function drawTriangle(context: CanvasRenderingContext2D, vertices: Point[]) {
  if (vertices.length !== 3) {
    console.error('Número inválido de vértices. O triângulo precisa de exatamente 3 vértices.');
    return;
  }

  // Move para o primeiro vértice
  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);

  // Desenha linhas para os outros vértices
  for (let i = 1; i < 3; i++) {
    context.lineTo(vertices[i].x, vertices[i].y);
  }

  // Fecha o caminho para formar um triângulo
  context.closePath();

  // Traça o caminho para realmente desenhá-lo
  context.stroke();
}

// Obtém o elemento canvas e seu contexto de renderização 2D
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

const windowWidth = window.innerWidth * 0.75;
const windowHeight = window.innerHeight * 0.75;

canvas.width = windowWidth;
canvas.height = windowHeight;

// Array para armazenar vértices para cada triângulo
const triangles: Point[][] = [];
let currentVertices: Point[] = [];
let isDrawing = false;

// Obtém o elemento colorPicker
const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;

function updateTriangleTable() {
  const triangleTable = document.getElementById('triangleTable') as HTMLTableElement; // Cast to HTMLTableElement
  // Limpa a tabela, mantendo o cabeçalho
  while (triangleTable.rows.length > 1) {
    triangleTable.deleteRow(1);
  }

  // Adiciona cada triângulo à tabela
  for (const vertices of triangles) {
    const triangleId = vertices[0].id; // Assume que o ID do triângulo é o ID do primeiro vértice
    const row = triangleTable.insertRow();
    
    // Cria a célula para o ID do triângulo
    const cellId = row.insertCell(0);
    cellId.innerHTML = triangleId;

    // Cria a célula para o botão "Delete"
    const cellDelete = row.insertCell(1);
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', () => deleteTriangle(triangleId));
    cellDelete.appendChild(deleteButton);
  }
}
function clearTriangleFromCanvas(vertices: Point[]) {
  // Limpa apenas o triângulo especificado
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Redesenha os triângulos restantes
  for (const triVertices of triangles) {
    drawTriangle(context, triVertices);

    // Redesenha os pontos dos triângulos restantes
    for (const vertex of triVertices) {
      context.beginPath();
      context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
      context.fillStyle = vertex.color;
      context.fill();
      context.stroke();
    }
  }
}


function deleteTriangle(triangleId: string) {
  // Encontra e remove o triângulo com o ID correspondente
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


// Event listener para cliques do mouse no canvas
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Usa a cor selecionada
  const pointColor = colorPicker.value;

  // Adiciona o ponto clicado com sua cor ao array currentVertices
  const pointId = generateUniqueId();
  currentVertices.push({ x: mouseX, y: mouseY, color: pointColor, id: pointId });

  // Desenha todos os triângulos armazenados
  for (const vertices of triangles) {
    drawTriangle(context, vertices);
  }

  // Desenha os vértices para o triângulo atual
  for (const vertex of currentVertices) {
    context.beginPath();
    context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);

    // Usa a cor associada ao ponto
    context.fillStyle = vertex.color;

    context.fill();
    context.stroke();
  }

  // Desenha o triângulo atual se houverem três vértices presentes
  if (currentVertices.length === 3) {
    drawTriangle(context, currentVertices);
    triangles.push(currentVertices);
    currentVertices = [];
    updateTriangleTable();
  }
});


// Função para limpar o canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  triangles.length = 0; // Limpa o array de triângulos
  triangles.splice();
  currentVertices = [];
}



// Event listener para o botão de limpar
const clearButton = document.getElementById('clearButton') as HTMLButtonElement;
clearButton.addEventListener('click', clearCanvas);
