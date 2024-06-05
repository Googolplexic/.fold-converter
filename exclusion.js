console.log('exclusion.js loaded');

function excludeVertex(jsonData, vertexToRemove, edge1, edge2) {
    for (let i = 0; i < 2; i++) {
        if (jsonData.edges_vertices[edge1][i] != vertexToRemove) {
            for (let j = 0; j < 2; j++) {
                if (jsonData.edges_vertices[edge2][j] != vertexToRemove) {
                    jsonData.edges_vertices[edge1][i] = jsonData.edges_vertices[edge2][j];
                    delete jsonData.edges_vertices[edge2];
                    delete jsonData.edges_assignment[edge2];
                    delete jsonData.edges_foldAngle[edge2];
                    delete jsonData.vertices_coords[vertexToRemove];
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
            excludeVertex(jsonData, i, edge1, edge2);
        }
    }
}