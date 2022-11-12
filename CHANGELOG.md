# Changelog

All notable changes to this project will be documented in this file.

## [0.3.3] - 2022-11-12

### Added

- Added types definition for npm configuration.
- Added new polygon methods:
  - `fromUnorderedEdges` is a static method that creates a polygon object from a set of unordered edges.
  - `hatchFill ` is an instance method that generates a collection of evenly spaced parallel lines that would fill the polygon.

### Changed

 - Polygons constructed with consecutive vertices that are equivalent will ignore the equivalent vertices.
 - The polygon constructor is more resiliant to edge-case arguments.
 - Polygon anchor points are now correctly calculated with a centroid algorithm instead of an arithmetic mean of vertex coordinates.

## [0.3.2] - 2022-05-30

### Added

- Added the `CategoricalVariable` class with tests, minimal API documentation and support for the following operations:
  - Constructing a simple categorical variable with non-normalized weightings.
  - Retrieve normalized category weightings.
  - Retrieve categories from normalized values (can be used for randomly selecting categories).

## [0.3.1] - 2022-05-26

### Changed

- Restructured project code hierarchy
- Renamed project from `bp2d` to `gactk`. The scope of the project has increased from a simple polygon library to a generalized toolkit to make creating generative art a little more streamlined.

## [0.3.0] - 2022-05-26

### Added

- Added the `Polygon` class with tests, minimal API documentation and support for the following operations:
  - Shorthand construction
  - Copying
  - Log formatting
  - Edge intersections
  - Polygon translation
  - Polygon scaling
  - Polygon rotation
  - Polygon reflection
  - Self overlap splitting
  - Edge offsetting
- Added equivalency based comparison to the `Vertex` class.

## [0.2.1] - 2022-05-10

### Added

- Added the `Vertex` class with tests, minimal API documentation and support for the following operations (the purpose of this class differs from the existing `Vector` class mostly from a conceptual stand point):
  - Shorthand construction
  - Copying
  - Log formatting
  - Vertex translation
  - Vertex scaling
  - Vertex rotation
  - Vertex reflection
  - Distance calculation
  - Angle calculation
- Added conversion methods to convert between `Vertex` and `Vector` classes.

### Changed
- Renamed `Vector2` class to `Vector`. There is no need to specify the 2 (for two-dimensions) when the library is inherently two-dimensional.
- Replaced use of `Vector` in `Edge` with `Vertex`.

## [0.2.0] - 2022-05-08

### Added

- Added the `Edge` class with tests, minimal API documentation and support for the following operations:
  - Shorthand construction
  - Copying
  - Log formatting
  - Displacement vector calculation
  - Normal vector calculation
  - Length calculation
  - Intersect edges

## [0.1.2] - 2022-05-07

### Added

- Subtraction of `Vector2` objects is now directly supported without having to combine scale and add calls.
- Vector2 objects can now be constructed using the shorthand `vec2` function.
- Added additional tests for static calls to `Vector2` methods that normally mutate the class instance.

## [0.1.1] - 2022-04-30

### Added

- Initialized repository support semi-automated building and testing using webpack.
- Added the `Vector2` class with tests, minimal API documentation and support for the following operations:
  - Copying
  - Log formatting
  - Unit vector creation
  - Magnitude calculation
  - Angle calculation
  - Shared angle calculation
  - Dot product calculation
  - Cross product calculation
  - Vector addition
  - Vector scaling
  - Vector normalization
  - Vector rotation
  - Vector reflection