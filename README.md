# .fold file face_vertices converter and vertex excluder

[Try it out](https://googolplexic.github.io/.fold-file_face_converter/)

## Description

A simple HTML page that calls the FOLD API to add the faces_vertices property to a (2D) .fold file, displaying the results afterwards. Useful for exporting a .fold file from software such as [Oriedita](https://github.com/oriedita/oriedita) to view on https://origamisimulator.org.
To do this, there is a script to remove/exclude extra vertices, similar to the "Remove extra vertices" function from Oriedita.
Also, the console will log which vertices in the fold fail Maekawa's theorem as a light flat-foldability check (Might add more in the future)

![Image](https://github.com/Googolplexic/.fold-file_face_converter/assets/52732344/73872b69-8562-4537-a082-58bd77d50c56)
Vertex exclusion example with a crease pattern of a chess rook (See sample): before and after (the right is compatible with [origamisimulator.org](https://origamisimulator.org) while the left is not)

## Acknowledgements

This project includes code from the [FOLD Project](https://edemaine.github.io/fold/) by Erik Demaine, Jason Ku, Robert Lang, licensed under the MIT License.

## License

This project uses code licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
