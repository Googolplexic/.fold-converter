console.log('exclusion.js loaded');

// Moves the indices of the vertices in edges_vertices, meant for after removing a vertex
function shiftVertices(fold, vertexToRemove) {
    for (let edge of fold.edges_vertices) {

        // For each of the two vertices the edge connects
        for (let i = 0; i < 2; i++) {
            if (edge[i] > vertexToRemove) {
                edge[i]--;
            }
        }
    }
}

/*  Given a vertex to exclude and the 2 edges that connect to it, edge1 and edge2, 
    change the vertex in common from edge1 to the vertex not in common in edge2, 
    then delete the vertex and edge2. */
function excludeVertex(fold, vertexToRemove, edge1, edge2) {
    const edge1Index = fold.edges_vertices[edge1].indexOf(vertexToRemove);

    // Get vertex not removed in edge 2
    const edge2Index = fold.edges_vertices[edge2].indexOf(vertexToRemove) == 0 ? 1 : 0;
    fold.edges_vertices[edge1][edge1Index] = fold.edges_vertices[edge2][edge2Index];
    fold.edges_vertices.splice(edge2, 1);
    fold.edges_assignment.splice(edge2, 1);
    fold.edges_foldAngle.splice(edge2, 1);
    fold.vertices_coords.splice(vertexToRemove, 1);
    shiftVertices(fold, vertexToRemove);
}

/*  Assuming unrotated rectangle/square, check if a given vertex is a corner
    by checking the edge assignment and the vertex location */
function isCorner(fold, targetVertex, edge1, edge2, epsilon) {

    // If the edges aren't assigned to be paper edges, return false
    if (!fold.edges_assignment[edge1] == 'B' || !fold.edges_assignment[edge2] == 'B') {
        return false;
    }

    // Find corner values
    const targetVertexX = fold.vertices_coords[targetVertex][0];
    const targetVertexY = fold.vertices_coords[targetVertex][1];
    let minValue = [targetVertexX, targetVertexY];
    let maxValue = [targetVertexX, targetVertexY];
    for (let vertex of fold.vertices_coords) {
        minValue[0] = Math.min(minValue[0], vertex[0]);
        minValue[1] = Math.min(minValue[1], vertex[1]);
        maxValue[0] = Math.max(maxValue[0], vertex[0]);
        maxValue[1] = Math.max(maxValue[1], vertex[1]);
    }

    // Check if vertex is corner
    return (targetVertexX + epsilon > maxValue[0] && targetVertexY + epsilon > maxValue[1]
        || targetVertexX + epsilon > maxValue[0] && targetVertexY - epsilon < minValue[1]
        || targetVertexX - epsilon < minValue[0] && targetVertexY + epsilon > maxValue[1]
        || targetVertexX - epsilon < minValue[0] && targetVertexY - epsilon < minValue[1]);
}

// Checks if the vertex is on the edge of the fold
function isOnEdge(fold, targetVertex, epsilon) {

    // Find corner values
    const targetVertexX = fold.vertices_coords[targetVertex][0];
    const targetVertexY = fold.vertices_coords[targetVertex][1];
    let minValue = [targetVertexX, targetVertexY];
    let maxValue = [targetVertexX, targetVertexY];
    for (let vertex of fold.vertices_coords) {
        minValue[0] = Math.min(minValue[0], vertex[0]);
        minValue[1] = Math.min(minValue[1], vertex[1]);
        maxValue[0] = Math.max(maxValue[0], vertex[0]);
        maxValue[1] = Math.max(maxValue[1], vertex[1]);
    }

    // Check if vertex is on the edge
    return (targetVertexX + epsilon > maxValue[0] || targetVertexY + epsilon > maxValue[1]
        || targetVertexX - epsilon < minValue[0] || targetVertexY - epsilon < minValue[1]);
}

// Checks if the slope of the two given edges are the same
function edgesNotParallel(fold, edge1, edge2, epsilon) {
    const XchangeInEdge1 = fold.vertices_coords[fold.edges_vertices[edge1][0]][0]
        - fold.vertices_coords[fold.edges_vertices[edge1][1]][0];
    const YchangeInEdge1 = fold.vertices_coords[fold.edges_vertices[edge1][0]][1]
        - fold.vertices_coords[fold.edges_vertices[edge1][1]][1];
    const XchangeInEdge2 = fold.vertices_coords[fold.edges_vertices[edge2][0]][0]
        - fold.vertices_coords[fold.edges_vertices[edge2][1]][0];
    const YchangeInEdge2 = fold.vertices_coords[fold.edges_vertices[edge2][0]][1]
        - fold.vertices_coords[fold.edges_vertices[edge2][1]][1];

    // First check if slopes are undefined
    if (Math.abs(XchangeInEdge1) < epsilon || Math.abs(XchangeInEdge2) < epsilon) {
        return Math.abs(XchangeInEdge1) > epsilon || Math.abs(XchangeInEdge2) > epsilon;
    }
    return (Math.abs(YchangeInEdge1 / XchangeInEdge1 - YchangeInEdge2 / XchangeInEdge2) > epsilon);
}

/*  Determines if a vertex should be removed based on if: 
        - it is a corner
        - the two edges are the same alignment (mountain, valley, or edge) 
        - the two edges do not form a straight line 
    If it doesn't meet these criteria it ignores the removal */
function shouldBeRemoved(fold, vertexToRemove, edge1, edge2) {
    if (isCorner(fold, vertexToRemove, edge1, edge2, 0.001)) {
        console.log("Vertex is a corner, ignoring vertex.\n")
        return false;
    }

    if (fold.edges_assignment[edge1] != fold.edges_assignment[edge2]) {
        console.log("Edges are different orientation, ignoring.\n")
        return false;
    }

    if (edgesNotParallel(fold, edge1, edge2, 0.001)) {
        console.log("Edges are not parallel, ignoring vertex.\n")
        return false;
    }

    console.log("Removing vertex" + vertexToRemove + "\n");
    return true;
}


// Main function to be called. Removes all exclusions (also logs if vertex fails Maekawa's theorem)
function findExclusions(fold) {
    let numVertices = Object.keys(fold.vertices_coords).length;
    let numEdges = Object.keys(fold.edges_vertices).length;

    // For each vertex in the fold
    for (let i = 0; i < numVertices; i++) {
        console.log("Looking at vertex" + i + "\n");
        let vertexDegree = 0;
        let edge1 = -1;
        let edge2 = -1;

        // Look at each edge connected to the vertex
        for (let j = 0; j < numEdges; j++) {
            if (fold.edges_vertices[j].includes(i)) {

                // Keep track of the vertex degree, as well as the first two edges connected
                if (++vertexDegree <= 2) { (edge1 == -1) ? edge1 = j : edge2 = j; }
            }
        }

        // If the vertex needs to be excluded, do so and adjust the fold data
        if (vertexDegree == 2 && shouldBeRemoved(fold, i, edge1, edge2)) {
            excludeVertex(fold, i, edge1, edge2);
            numEdges--;
            i--;
            numVertices--;
        }

        // Maekawa's theorem check
        if (vertexDegree % 2 == 1 && !isOnEdge(fold, i, 0.001)) {
            console.log("Maekawa's theorem broken: a vertex is not flat-foldable.\n");
            console.log("The program will still perform all exclusions.\n");
        }

    }
}


