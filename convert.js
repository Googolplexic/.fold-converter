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
                downloadLink.textContent = 'Download Processed File';
                downloadLink.click();  // Automatically click the link to start the download

            } catch (error) {
                console.error('Error parsing JSON: ', error);
            }
        };

        reader.readAsText(file); // Read the file as text
    }
});