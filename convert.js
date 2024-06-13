document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    FOLD = require('fold');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                // Parse the file contents as JSON
                const fold = JSON.parse(e.target.result);

                // Use FOLD to add faces_vertices
                findExclusions(fold);
                FOLD.convert.edges_vertices_to_faces_vertices(fold);
                const theData = document.getElementById('data');

                theData.textContent = JSON.stringify(fold);
                // Create a Blob from the processed JSON data
                const blob = new Blob([JSON.stringify(fold, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                // Get the original file name and append "_faces-added"
                const originalFileName = file.name;
                const fileNameParts = originalFileName.split('.');
                const newFileName = fileNameParts[0] + '_faces-added.' + fileNameParts.slice(1).join('.');
                // Create and configure the download link
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = url;
                downloadLink.download = newFileName;
                downloadLink.style.display = 'block';
                downloadLink.textContent = 'Download Converted File';
                downloadLink.click();  // Automatically click the link to start the download

                setupViewerWithBlob(blob, newFileName, url);

            } catch (error) {
                console.error('Error parsing JSON: ', error);
            }
        };

        reader.readAsText(file); // Read the file as text
    }
});

function setupViewerWithBlob(blob, exampleName, url) {
    const view1 = document.getElementById('view1');
    FOLD = require('fold');
    // Read the Blob as text
    const reader = new FileReader();
    reader.onload = function (event) {
        const inputString = event.target.result;

        // Define the options, including examples
        const options = {
            examples: {}, // Initialize as an empty object
            import: false,
        };

        // Add the example data to the examples object
        options.examples[exampleName] = url;
        // Call the addViewer function with the container div and options
        FOLD.viewer.addViewer(view1, options);
        svg = view1.getElementsByTagName("svg")[0];
        svg.style.pointerEvents = "none";
        svg.style["font-size"] = "0.04px";

    };

    reader.readAsText(blob); // Read the Blob as text
}