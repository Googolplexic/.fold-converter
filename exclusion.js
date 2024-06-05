console.log('exclusion.js loaded');

function shiftVertices(jsonData, vertexToRemove) {
    for (let edge of jsonData.edges_vertices) {
        for (let i = 0; i < edge.length; i++) {
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

function findExclusions(jsonData) {
    let numVertices = Object.keys(jsonData.vertices_coords).length;
    let numEdges = Object.keys(jsonData.edges_vertices).length;
    for (let i = 0; i < numVertices; i++) {
        let vertexDegree = 0;
        let edge1 = -1;
        let edge2 = -1;
        for (let j = 0; j < numEdges; j++) {
            if (jsonData.edges_vertices[j].includes(i)) {
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
            numEdges--;
            numVertices--;
        }
    }
}