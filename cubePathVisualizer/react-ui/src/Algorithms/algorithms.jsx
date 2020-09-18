import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as setFaceColor from "../Helpers/helper.js"
import Queue from "./Queue"
import Stack from "./Stack"
import PriorityQueue from "./PriorityQueue"
import * as helper from "../Helpers/helper.js"
import * as THREE from "three";



export default class Graph extends React.Component  {
    
        constructor(props)
        { 
            super(props);
            console.log("Creating graph");
            console.log(props);
            this.noOfVertices = props.length; 
            this.AdjList = new Map(); 
            this.delay = 50;
            this.heuristic = this.heuristic.bind(this);
            this.vertices = props.vertices;
            this.cubeIndex = props.cubeIndex;
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

        dfs(startingNode, target) {
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
            var s = new Stack(); 
            s.push(startingNode); 
            var path = [];
            while(!s.isEmpty()){
                let v = s.peek();
                s.pop();
                var get_List = this.AdjList.get(String(v)); 
                for(var i in get_List){
                    var neigh = get_List[i]; 
                        if (!visited[neigh]) { 
                            visited[neigh] = true; 
                            visitedNodesInOrder.push(neigh);
                            if (distances[neigh] === INF) {
                                distances[neigh] = distances[v] + 1;
                                pred[neigh] = v;
                                s.push(neigh);
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


    dijkastra(startingNode, target){
        var weight = [];
        const INF = 1000000;
        let visitedNodesInOrder = [];
        var distances = Array(this.noOfVertices).fill(INF);
        console.log(startingNode, target);
        distances[startingNode] = 0;
        var pred = []; 
        for (var i = 0; i < this.noOfVertices; i++)
        { 
            weight[i] = 1;
            pred[i] = -1; 
        }
        var pq = new PriorityQueue(); 
        pq.enqueue(distances[startingNode], startingNode); 
        var path = [];
        while(!pq.isEmpty()){
            let value = pq.front();
            console.log(value);
            pq.dequeue();
            var d = value.priority;
            var v = value.element;
            if(d > distances[v]) continue
            var get_List = this.AdjList.get(String(v)); 
            console.log(get_List);
            for(var i in get_List){
                var neigh = get_List[i];
                var w = weight[neigh];
                console.log(neigh, w); 
                console.log(distances[v] + w < distances[neigh]);
                if(distances[v] + w < distances[neigh]){
                    distances[neigh] = distances[v] + w;
                    pq.enqueue(distances[neigh], neigh); 
                    visitedNodesInOrder.push(neigh);
                    pred[neigh] = v;
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
        return visitedNodesInOrder
    }


    a_star(startingNode, target){
        let visitedNodesInOrder = [];
        const INF = 1000000;
        console.log(startingNode, target);
        var pred = []; 
        var gScore = [];
        var fScore = [];
        var hScore = [];
        for (var i = 0; i < this.noOfVertices; i++)
        { 
            pred[i] = -1; 
            gScore[i] = INF;
            hScore[i] = INF;
            fScore[i] = INF;
        }
        gScore[startingNode] = 0;
        hScore[startingNode] = this.heuristic(this.vertices[String(startingNode)], this.vertices[String(target)]);
        fScore = hScore;
        let openSet = new PriorityQueue();
        let closedSet = [];
        openSet.enqueue(fScore[startingNode], startingNode); 
        var path = [];
        let parent = [];
        console.log(openSet.isEmpty())
        while(!openSet.isEmpty()){
            let value = openSet.front();
            console.log(openSet, value);
            if(value.element === target){
                console.log("Done");
                while (pred[target] != -1) {
                            
                    path.push(pred[target]); 
                    target = pred[target]; 
                }
                
                // console.log(path);
                console.log(visitedNodesInOrder);
                return [visitedNodesInOrder, path];
            }
            openSet.dequeue();
            var d = value.priority;
            var v = value.element;
            closedSet.push(String(v));
            var get_List = this.AdjList.get(String(v)); 
            console.log(get_List);
            for(var i in get_List){
                var neigh = get_List[i];
                console.log(neigh); 
                if(!closedSet.includes(neigh)){
                    let tempGScore = gScore[v] + this.heuristic(this.vertices[String(neigh)], this.vertices[String(v)]);
                    console.log("gScores:::", tempGScore, gScore[neigh])
                    var vertex = this.vertices[String(neigh)]
                    if(openSet.includes(neigh)){
                        if(tempGScore < gScore[neigh]){
                            console.log("if here",closedSet, neigh)
                            parent[neigh] = v;
                            var facePenalty = helper.checkHowManyFaces(vertex[0],vertex[1],vertex[2], this.cubeIndex);
                            console.log("Face",facePenalty);
                            gScore[neigh] = tempGScore;
                            hScore[neigh] = this.heuristic(this.vertices[String(neigh)], this.vertices[String(target)]);
                            fScore[neigh] = gScore[neigh] + hScore[neigh];
                            if(facePenalty-1) fScore[neigh] = fScore[neigh] + 1;
                            }
                        }
                        else{
                            console.log("else here",closedSet, neigh)
                            parent[neigh] = v;
                            gScore[neigh] = tempGScore;
                            var facePenalty = helper.checkHowManyFaces(vertex[0],vertex[1],vertex[2], this.cubeIndex);
                            console.log("else Face",facePenalty);
                            hScore[neigh] = this.heuristic(this.vertices[String(neigh)], this.vertices[String(target)]);
                            fScore[neigh] = gScore[neigh] + hScore[neigh];
                            if(facePenalty-1) fScore[neigh] = fScore[neigh] + 1;
                            visitedNodesInOrder.push(neigh);
                            openSet.enqueue(fScore[neigh], neigh);
                        }   
            }
            console.log("fScores:::",fScore[neigh]) 
        } 
        console.log("openset after loop:::", openSet.printPQueue())
    } 
        console.log(visitedNodesInOrder, closedSet)  
        return visitedNodesInOrder
    }

    heuristic(a,b){
        // console.log("heuristic", a,b, this.AdjList);
        // var heuristic = Math.sqrt(Math.pow((a[0] - b[0]),2) + 
        //                           Math.pow((a[1] - b[1]),2) +
        //                           Math.pow((a[2] - b[2]),2))

        var heuristic = Math.abs((a[0] - b[0]))+ 
                        Math.abs((a[1] - b[1]))+
                        Math.abs((a[2] - b[2]))
        console.log("heuristic:::", heuristic)                        
        return heuristic;
    }

}
