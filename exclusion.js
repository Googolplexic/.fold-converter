console.log('exclusion.js loaded');

function shiftVertices(jsonData, vertexToRemove) {
    for (let edge of jsonData.edges_vertices) {
        for (let i = 0; i < 2; i++) {
            if (edge[i] > vertexToRemove) {
                edge[i]--;
            }
        }
    }
}

function excludeVertex(jsonData, vertexToRemove, edge1, edge2) {
    const edge1Index = jsonData.edges_vertices[edge1].indexOf(vertexToRemove);
    const edge2Index = jsonData.edges_vertices[edge2].indexOf(vertexToRemove) == 0 ? 1 : 0;
    jsonData.edges_vertices[edge1][edge1Index] = jsonData.edges_vertices[edge2][edge2Index];
    jsonData.edges_vertices.splice(edge2, 1);
    jsonData.edges_assignment.splice(edge2, 1);
    jsonData.edges_foldAngle.splice(edge2, 1);
    jsonData.vertices_coords.splice(vertexToRemove, 1);
    shiftVertices(jsonData, vertexToRemove);
}

// Assuming unrotated rectangle/square
function isCorner(jsonData, targetVertex, edge1, edge2, elipson) {
    if (!jsonData.edges_assignment[edge1] == 'B' || !jsonData.edges_assignment[edge2] == 'B') {
        return false;
    }
    const targetVertexX = jsonData.vertices_coords[targetVertex][0];
    const targetVertexY = jsonData.vertices_coords[targetVertex][1];
    let minValue = [targetVertexX, targetVertexY];
    let maxValue = [targetVertexX, targetVertexY];
    for (let vertex of jsonData.vertices_coords) {
        minValue[0] = Math.min(minValue[0], vertex[0]);
        minValue[1] = Math.min(minValue[1], vertex[1]);
        maxValue[0] = Math.max(maxValue[0], vertex[0]);
        maxValue[1] = Math.max(maxValue[1], vertex[1]);
    }
    return (targetVertexX + elipson > maxValue[0] && targetVertexY + elipson > maxValue[1]
        || targetVertexX + elipson > maxValue[0] && targetVertexY - elipson < minValue[1]
        || targetVertexX - elipson < minValue[0] && targetVertexY + elipson > maxValue[1]
        || targetVertexX - elipson < minValue[0] && targetVertexY - elipson < minValue[1]);
}

function shouldBeRemoved(jsonData, vertexToRemove, edge1, edge2) {
    if (isCorner(jsonData, vertexToRemove, edge1, edge2, 0.001)) {
        console.log("Vertex is a corner, will ignore.\n")
        return false;
    }
    if (jsonData.edges_assignment[edge1] != jsonData.edges_assignment[edge2]) {
        console.log("Edges are different orientation, cannot exclude vertex.\n")
        return false;
    }
    console.log("Removing vertex" + vertexToRemove + "\n");
    return true;
}

function findExclusions(jsonData) {
    let numVertices = Object.keys(jsonData.vertices_coords).length;
    let numEdges = Object.keys(jsonData.edges_vertices).length;
    for (let i = 0; i < numVertices; i++) {
        console.log("Looking at vertex" + i + "\n");
        let vertexDegree = 0;
        let edge1 = -1;
        let edge2 = -1;
        for (let j = 0; j < numEdges; j++) {
            if (jsonData.edges_vertices[j].includes(i)) {
                if (++vertexDegree > 2) { break; }
                (edge1 == -1) ? edge1 = j : edge2 = j;
            }
        }
        if (vertexDegree == 2 && shouldBeRemoved(jsonData, i, edge1, edge2)) {
            excludeVertex(jsonData, i, edge1, edge2);
            numEdges--;
            i--;
            numVertices--;
        }
    }
}