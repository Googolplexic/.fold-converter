console.log('exclusion.js loaded');

function shiftVertices(jsonData, vertexRemoved) {
    for (let i = 0, numEdges = Object.keys(jsonData.edges_vertices).length; i < numEdges; i++) {
        for (let j = 0; j < 2; j++) {
            if (jsonData.edges_vertices[i][j] > vertexRemoved) {
                jsonData.edges_vertices[i][j]--;
            }
        }
    }
}

function excludeVertex(jsonData, vertexToRemove, edge1, edge2) {
    for (let i = 0; i < 2; i++) {
        if (jsonData.edges_vertices[edge1][i] == vertexToRemove) {
            for (let j = 0; j < 2; j++) {
                if (jsonData.edges_vertices[edge2][j] != vertexToRemove) {
                    jsonData.edges_vertices[edge1][i] = jsonData.edges_vertices[edge2][j];
                    jsonData.edges_vertices.splice(edge2, 1);
                    jsonData.edges_assignment.splice(edge2, 1);
                    jsonData.edges_foldAngle.splice(edge2, 1);
                    jsonData.vertices_coords.splice(vertexToRemove, 1);
                    shiftVertices(jsonData, vertexToRemove);
                    return;
                }
            }
        }
    }
}

function findExclusions(jsonData) {
    for (let i = 0, numVertices = Object.keys(jsonData.vertices_coords).length; i < numVertices; i++) {
        let vertexDegree = 0;
        let edge1 = -1;
        let edge2 = -1;
        for (let j = 0, numEdges = Object.keys(jsonData.edges_vertices).length; j < numEdges; j++) {
            if (jsonData.edges_vertices[j][0] == i || jsonData.edges_vertices[j][1] == i) {
                if (++vertexDegree > 2) { break; }
                (edge1 == -1) ? edge1 = j : edge2 = j;
            }
        }
        if (vertexDegree == 2 && jsonData.edges_assignment[edge1] == jsonData.edges_assignment[edge2]) {
            console.log(i + '\n');
            console.log(edge1 + '\n');
            console.log(edge2 + '\n');
            console.log(jsonData.edges_vertices[edge2][1]);
            excludeVertex(jsonData, i, edge1, edge2);
        }
    }
}