import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as setFaceColor from "../Helpers/helper.js"


export default function BFS() {
    
    class Graph {
        constructor(noOfVertices) 
        { 
            this.noOfVertices = noOfVertices; 
            this.AdjList = new Map(); 
        } 
      
      
        addVertex(v) { 
            this.AdjList.set(v, []); 
        }

        addEdge(v, w) { 
            this.AdjList.get(v).push(w); 
            this.AdjList.get(w).push(v); 
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
      
        // bfs(v) 
        // dfs(v) 
    }

}