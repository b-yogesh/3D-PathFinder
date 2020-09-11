import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as setFaceColor from "../Helpers/helper.js"
import Queue from "./Queue"
import * as helper from "../Helpers/helper.js"
import * as THREE from "three";



export default class BFS extends React.Component  {
    
        constructor(props)
        { 
            super(props);
            console.log("Creating graph");
            this.noOfVertices = props; 
            this.AdjList = new Map(); 
            this.delay = 50;
        } 
      
      
        addVertex(v) { 
            this.AdjList.set(v, []); 
        }

        addEdge(v, w) { 
            //console.log(v,w);
            let hasEdgeW, hasEdgeV = false;
            for (let k in this.AdjList.get(String(v))) {
                if (this.AdjList.get(String(v))[k] === String(w)) {
                    hasEdgeW = true;
                }
            }
            for (let k in this.AdjList.get(String(w))) {
                if (this.AdjList.get(String(w))[k] === String(v)) {
                    hasEdgeV = true;
                }
            }
            if(!hasEdgeW)
            this.AdjList.get(String(v)).push(String(w)); 
            if(!hasEdgeV)
            this.AdjList.get(String(w)).push(String(v)); 
        } 

        printGraph(){ 
            var get_keys = this.AdjList.keys(); 
        
            for (var i of get_keys){ 
                var get_values = this.AdjList.get(i); 
                var conc = ""; 
        
                for (var j of get_values) 
                    conc += j + " "; 
        
                console.log(i + " -> " + conc); 
                } 
        }
      
        bfs(startingNode, target){
            var visited = []; 
            const INF = 1000000;
            let visitedNodesInOrder = [];
            var distances = Array(this.noOfVertices).fill(INF);
            console.log(startingNode, target);
            distances[startingNode] = 0;
            var pred = []; 
             for (var i = 0; i < this.noOfVertices; i++)
             { 
                 visited[i] = false;
                 pred[i] = -1; 
             }
        
            
            visited[startingNode] = true; 
            var q = new Queue(); 
            q.enqueue(startingNode); 
            var path = [];
            //path.push(target);
            while (!q.isEmpty()) { 
                var getQueueElement = q.dequeue(); 
                 console.log(getQueueElement); 
                var get_List = this.AdjList.get(String(getQueueElement)); 
                 console.log("Getlist", get_List, q, this.AdjList,  this.AdjList.get(String(getQueueElement)));
                for (var i in get_List) {
                        console.log("i...",i,get_List);
                        var neigh = get_List[i]; 
                        if (!visited[neigh]) { 
                            visited[neigh] = true; 
                            visitedNodesInOrder.push(neigh);
                            if (distances[neigh] === INF) {
                                distances[neigh] = distances[getQueueElement] + 1;
                                pred[neigh] = getQueueElement;
                                q.enqueue(neigh);
                                // console.log(neigh,vertices[neigh] );
                                if(parseInt(neigh) === parseInt(target)){
                                    console.log(pred);
                                    
                                    while (pred[target] != -1) {

                                        path.push(pred[target]); 
                                        target = pred[target]; 
                                    }
                                    
                                    // console.log(path);
                                    console.log(visitedNodesInOrder);
                                    return [visitedNodesInOrder, path];
                                }
                            } 
                            } 
                    } 
                }
                return visitedNodesInOrder

    }
}
