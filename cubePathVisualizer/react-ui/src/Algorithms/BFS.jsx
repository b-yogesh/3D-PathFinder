import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as setFaceColor from "../Helpers/helper.js"
import Queue from "./Queue"


export default class BFS extends React.Component  {
    
        constructor(props)
        { 
            super(props);
            console.log("Creating graph");
            this.noOfVertices = props; 
            this.AdjList = new Map(); 
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
      
        bfs(startingNode){
            var visited = []; 
            const INF = 1000000;
            var distances = Array(this.noOfVertices).fill(INF);
            // console.log(this.noOfVertices,distances);
            distances[startingNode] = 0;
            var pred = [];
            let target = 24;
             for (var i = 0; i < this.noOfVertices; i++)
             { 
                 visited[i] = false;
                 pred[i] = -1; 
             }
        
            
            visited[startingNode] = true; 
            var q = new Queue(); 
            q.enqueue(startingNode); 
        
            while (!q.isEmpty()) { 
                var getQueueElement = q.dequeue(); 
                // console.log(getQueueElement); 
                var get_List = this.AdjList.get(getQueueElement); 
                //console.log("Getlist", get_List);
                // const d = distances[getQueueElement] + 1;
                for (var i in get_List) {  
                    var neigh = get_List[i]; 
                    if (!visited[neigh]) { 
                        visited[neigh] = true; 
                        if (distances[neigh] === INF) {
                            distances[neigh] = distances[getQueueElement] + 1;
                            pred[neigh] = getQueueElement;
                        q.enqueue(neigh);
                        if(parseInt(neigh) === parseInt(target)){
                            console.log(pred);
                            var path = [];
                            while (pred[target] != -1) { 
                                path.push(pred[target]); 
                                target = pred[target]; 
                            }
                            console.log(path);
                            return path;
                        }
                     } 
                } 
            } 
        }
        console.log(distances, pred);
           
    }

}
