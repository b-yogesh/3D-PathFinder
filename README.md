# 3D-Pathfinder

This project was developed as a submission for the AlgoExpert.io [Summer 2020 Contest]

3D-Pathfinder is a fluid 3D, easy to understand and a new way to visualize pathfinding algorithms built on [Three.js].

#### Live Demo

Find the live demo [here]

# Features!

#### Algorithms

##### Breadth-First Search
BFS is a pathfinding algorithm where it starts traversing from a selected node (source or starting node) and traverses the graph layerwise thus exploring the neighbour nodes first.
&#x2611; Shortest path 

##### Depth-First Search
DFS algorithm is a recursive algorithm that uses the idea of backtracking. It involves exhaustive searches of all the nodes by going ahead, if possible, else by backtracking.
&#x2612; Shortest path 

##### Dijkstra’s algorithm
Dijkstra's Algorithm allows you to calculate the shortest path between one node (source or starting node) and every other node in the graph.
&#x2611; Shortest path 

##### A* Search algorithm
A* Search algorithm is a modification of Dijkstra’s Algorithm that is optimized for a single destination and it is one of the best and popular technique used in path-finding.
&#x2611; Shortest path 

##### Bi-directional BFS
Bidirectional search is a graph search algorithm that finds a shortest path from an initial vertex to a goal vertex in a directed graph. It runs two simultaneous searches: one forward from the initial state, and one backward from the goal, stopping when the two meet.
&#x2611; Shortest path 


#### Maze Generation

Random maze generator has been implemented which generates (walls/obstacles) randomly.


### Installation

3d-Pathfinder requires [Node.js](https://nodejs.org/) to run.
First, clone the repository to your preferred location.
Then cd into the cloned directory and run 
```sh
$ cd /path/to/cloned/directory
$ npm install
```
Once, the dependencies are installed, run
```sh
$ npm start
```

You now have the live server started at your localhost and can now play around with the code and application.


### Technologies Used
  - ReactJS
  - ThreeJS


### Attributions

My main inspiration to develop this project was Clément Mihailescu's [Pathfinding project].



### Todos
 - Add more Algorithms
 - Add more Maze generation algorithms
 - Add new shape (e.g. circle, instead of cube) for visualization



**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Summer 2020 Contest]: <https://www.algoexpert.io/swe-project-contests/2020-summer>
   [Three.js]: <https://threejs.org/>
   [Pathfinding project]: <https://github.com/clementmihailescu/Pathfinding-Visualizer>
  
