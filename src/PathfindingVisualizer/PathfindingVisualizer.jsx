import React, {Component} from 'react';
import './PathfindingVisualizer.css';
import Node from './Node'

import { dijkstra,getShortestDijkstraPath } from '../pathfinding algoritms/dijkstra';
import {astar ,getShortestAstarPath} from '../pathfinding algoritms/astar';
import {bfs,getShortestBFSPath} from '../pathfinding algoritms/bfs';
import {dfs,getShortestDFSPath} from '../pathfinding algoritms/dfs';
import {greedy,getShortestGreedyPath} from '../pathfinding algoritms/greedy';
// import {bidirectionalSearch,
//     getBidirectionalShortestPath} from '../pathfinding algoritms/bidirectionalSearch';
  
import randomMaze from '../maze algoritms/randomMaze'
import  recursiveDivisionMaze  from '../maze algoritms/recursiveMaze';
import  recursiveBacktracker  from '../maze algoritms/recursiveBacktracker';
import spiral from '../maze algoritms/spriralMaze';
import prim from '../maze algoritms/prim';

let startNodeRow = 10;
let startNodeCol = 10;
let finishNodeRow = 10;
let finishNodeCol = 40;

let algorithmRunning=false
let algorithmSpeed=10;

let wIsPressed=false

export default class PathfinidingVisualizer extends Component{
    constructor(){
        super();
        this.state={
            grid:[],
            mouseIsPressed:false,
            nodeToChange:''
            
        }
        document.addEventListener('keydown', function(event){
            if(event.key==="w"){
                wIsPressed=true
            }
          })
          document.addEventListener('keyup', function(event){
            if(event.key==="w"){
               wIsPressed=false
            }
          })
      
    }
    componentDidMount(){
          const grid=initializeGrid()
          this.setState({grid});
         
    }
   
    
    handleMouseDown(row,col,type){
        let newGrid
        if(algorithmRunning)return
        console.log("1");
        switch (type) {
            case 'normal-node':
                if(wIsPressed){
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'weight')
                    this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'weight'})
                    break 
                }else{
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'wall')
                    this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'wall'})
                }
                break;
            case 'wall':
                newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'normal-node')
                this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'normal-node'})
                break;
            case 'start':
                this.setState({mouseIsPressed:true, nodeToChange:'start'})
                
                break;
            case 'finish':
                this.setState({mouseIsPressed:true, nodeToChange:'finish'})
                break;
            default:
               
                break;
        }
   
    }
    handleMouseEnter(row,col,type){
        console.log("2");
        if(algorithmRunning)return
        if(!this.state.mouseIsPressed)return
        if(type==='wall'||type==='normal-node'){
            let newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,this.state.nodeToChange)
            this.setState({grid: newGrid});
        }  
    } 

    
    handleMouseUp(){
        console.log("3");
        this.setState({mouseIsPressed: false});
    }
    handleMouseLeave(row,col,type){
        console.log("4");
        let newGrid
        if(!this.state.mouseIsPressed)return
        if((type==='start'||type==='finish')&&this.state.nodeToChange!=='wall'){
            newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'normal-node')
            this.setState({grid: newGrid}); 
        }
    }

    visualizeAlgorithm(algorithm) {
    //    this.clearPath(this.state.grid) comment Me
        switch (algorithm) {
            case 0:
                break;
            case 1:
            //this.visualizeDijkstra(startNode, finishNode); comment Me
                this.findPath(dijkstra,getShortestDijkstraPath);
            break;
            case 2:
                this.findPath(astar,getShortestAstarPath,);
            break;
            case 3:
                this.clearNodes(this.state.grid,'weight')
                this.findPath(bfs,getShortestBFSPath)
                break;
            case 4:
                this.clearNodes(this.state.grid,'weight');
                this.findPath(dfs,getShortestDFSPath);
                break;
            case 5:
                this.findPath(greedy,getShortestGreedyPath);
            break;
          default:
              break
        }
        // algorithmRunning=false comment Me
      }
     
  
    findPath(algorithmCallback,getShortestPathCallback) {
        // this.setState({algorithmRunning:true}) comment Me
       
        let startNode = getNodeByType(this.state.grid,'start')
        let finishNode =getNodeByType(this.state.grid,'finish')

       
        
        
        const visitedNodesInOrder = algorithmCallback(
            this.state.grid,
            startNode,
            finishNode,
        
        )
       
        const nodeInShortestPath=getShortestPathCallback(finishNode)
        
        this.animateAlgorithm(visitedNodesInOrder,nodeInShortestPath);
       // algorithmRunning=false comment Me
    }
     
    animateAlgorithm(visitedNodesInOrder,nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, algorithmSpeed * i);
                return;
                }
        const node = visitedNodesInOrder[i];
        
        const nodeComponent=document.getElementById(`node-${node.row}-${node.col}`);
        setTimeout(() => {
            nodeComponent.classList.add('node-visiting');
        }, algorithmSpeed * (i - 0.8));
          setTimeout(() => {
            nodeComponent.classList.add('visited')
          }, algorithmSpeed * i);
         
        }
      }
      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            // if(document.getElementById(`node-${node.row}-${node.col}`).className =
            // 'node node-visiting')
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path')
          }, 50 * i);
        }
      
      }
      visualizeMaze(algorithm) {
        // this.clearWallsAndWeights(this.state.grid) comment Me
        let newGrid
        switch (algorithm) {
            case 0:
                break;
            case 1:
              this.findMaze(recursiveDivisionMaze,'wall')
            break;
            case 2:
               this.findMaze(recursiveBacktracker,'normal-node')
                break;
            case 3:
                this.findMaze(prim,'normal-node')
            break;
            case 4:
                this.findMaze(spiral,'wall')
                    break;
            case 5:
                 newGrid=randomMaze(this.state.grid,'wall')
                 this.setState({grid:newGrid})
                break;
            case 6:
                 newGrid=randomMaze(this.state.grid,'weight')
                this.setState({grid:newGrid})
                break;
           
          default:
              break
        }
        
      }
      findMaze(mazeCallback,type){
        this.clearWallsAndWeights(this.state.grid)
        const startNode=getNodeByType(this.state.grid,'start')
        const  finishNode=getNodeByType(this.state.grid,'finish')
        const nodesToAnimate= mazeCallback(this.state.grid, startNode,finishNode)
        this.animateMaze(nodesToAnimate,type)
      }
      animateMaze(nodesToAnimate,type) {
        
        for (let i = 1; i < nodesToAnimate.length; i++) {
            
          setTimeout(() => {
            const node = nodesToAnimate[i];
            if(node.type==='start'||node.type==='finish')return
            const newGrid=getNewGridWithNewNodeType(this.state.grid,node.row,node.col,type)
            this.setState({grid:newGrid})
          },1);
        }
      }
    clearWallsAndWeights(grid){
        this.clearNodes(grid,'wall')
        this.clearNodes(grid,'weight')
    }
    clearNodes(grid,type){
        const newGrid=grid.slice()
        for (const row of newGrid) {
            for (const node of row) {
               console.log(node)
               if(node.type==type){
                node.type="normal-node"
               
               } 
            }
          }
        this.setState({grid:newGrid})
    }
  

    clearBoard(){
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
        }
        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {
                if(row === startNodeRow && col === startNodeCol){
                    document.getElementById(`node-${row}-${col}`).className = "node start-node";
                }
                else if(row === finishNodeRow && col === finishNodeCol){
                    document.getElementById(`node-${row}-${col}`).className = "node finish-node";
                }
                else {
                    document.getElementById(`node-${row}-${col}`).className = "node";
                }
                }
              }
            const newGrid = initializeGrid();
            this.setState({
                grid: newGrid,
                visualizingAlgorithm: false,
                generatingMaze: false,
            });
        }
        
    clearPath(){
            let newGrid=this.state.grid.slice();
        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {
                
                if(document.getElementById(`node-${row}-${col}`).className === "node start-node node-visiting visited node-shortest-path") {
                    document.getElementById(`node-${row}-${col}`).className = "node start-node";
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,"start");
                }
                else if(document.getElementById(`node-${row}-${col}`).className === "node finish-node node-visiting visited node-shortest-path"){
                    
                    document.getElementById(`node-${row}-${col}`).className = "node finish-node";
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,"finish");
                } 
                else if((document.getElementById(`node-${row}-${col}`).className === "node node-visiting visited node-shortest-path") || (document.getElementById(`node-${row}-${col}`).className === "node node-visiting visited")){
                    
                    document.getElementById(`node-${row}-${col}`).className = "node";
                    newGrid[row][col]=getNewGridWithNewNodeType(this.state.grid,row,col,"node");
                }
                
            }
        }
        this.setState({grid:newGrid});
    }

    
        
    
    
    

    render(){        
        const {grid} = this.state;
        
        return(
          <div>
            <div className="header">
                <div className="logo"><span>Pathfiniding Visualizer</span></div>
                <div className="dropdown">
                    <button className="dropbtn"><span>Algorithms</span>
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={() => this.visualizeAlgorithm(1)}>Dijkstra</button>
                        <button onClick={() => this.visualizeAlgorithm(2)}>A*</button>
                        <button onClick={() => this.visualizeAlgorithm(3)}>Breadth First Search</button>
                        <button onClick={() => this.visualizeAlgorithm(4)}>Depth First Search</button>
                        <button onClick={() => this.visualizeAlgorithm(5)}>Greedy Best First Search</button>
                        
                    </div>
                    
                </div>
                <div className="dropdown">
                    <button className="dropbtn"><span>Mazes</span>
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={() => this.visualizeMaze(1)}>Recursive Division maze</button>
                        <button onClick={() => this.visualizeMaze(2)}>Recursive Backtracker</button>
                        <button onClick={() => this.visualizeMaze(3)}>Randomized Prim's algorithm</button>
                        <button onClick={() => this.visualizeMaze(4)}>Spriral Maze</button>
                        <button onClick={() => this.visualizeMaze(5)}>Random Wall Maze</button>
                        <button onClick={() => this.visualizeMaze(6)}>Random Weight Maze</button>
                    </div>
                </div>
                <div className="dropdown">
                <button className="dropbtn"><span>Speed</span>
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={()=>changeAlgoritmSpeed(125)}>Slow</button>
                        <button onClick={()=>changeAlgoritmSpeed(50)}>Medium</button>
                        <button onClick={()=>changeAlgoritmSpeed(10)}>Fast</button>
                    </div>
                </div>
                <button className="clear-walls" onClick={()=>this.clearWallsAndWeights(this.state.grid)}>Clear Walls & Weights </button>
                <button className="clear-walls" onClick={()=>this.clearBoard()}>Clear Board </button>
                <button className="clear-walls" onClick={()=>this.clearPath()}>Clear Path </button>

            </div>


            <div id='mainGrid'>
                <div id='mainText'>
                    <ul>
                    <li>
                        <div class="start"></div>Start Node</li>
                    <li>
                        <div class="target"></div>Target Node</li>
                    <li id="weightLegend">
                        <div class="borderlessWeight"></div>Weight Node</li>
                    <li>
                        <div class="unvisited"></div>Unvisited Node</li>
                    <li>
                        <div class="visited"></div>Visited Nodes</li>
                    <li>
                        <div class="shortest-path"></div>Shortest-path Node</li>
                    <li>
                        <div class="wall"></div>Wall Node</li>
                    </ul>
                </div>
                <div id="algorithmDescriptor">Pick up an algorithm and visualize it!</div>
            </div>


            <table className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                    <tr key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const{row,col,type,isVisited,distance,gScore,fScore,hScore,closed}=node
                        
                        return (
                            <Node 
                            key={nodeIdx}
                            row={row}
                            col={col}
                            type={type}
                            //isWall={isWall} comment Me
                          
                            isVisited={isVisited}
                            distance={distance}
                            gScore={gScore}
                            fScore={fScore}
                            hScore={hScore}
                            closed={closed}
                            onMouseDown={(row, col,type) => this.handleMouseDown(row, col,type)}
                            onMouseEnter={(row, col,type) => this.handleMouseEnter(row, col,type)} 
                            onMouseUp={() => this.handleMouseUp()} 
                            onMouseLeave={()=>this.handleMouseLeave(row,col,type)}
                         
                            ></Node>
                        );
                        })}
                    </tr>
                    );
                })}
                </table>
            </div>
        )
    }
   
}

// const clearPath=(grid)=>{
//     let newGrid=grid.slice();
//         for (let row = 0; row < grid.length; row++) {
//             for (let col = 0; col < grid[0].length; col++) {
                
//                 if(document.getElementById(`node-${row}-${col}`).className === "node start-node visited node-shortest-path") {
//                     // newGrid[row][col].className="node start-node"; 
//                     document.getElementById(`node-${row}-${col}`).className = "node start-node";
//                 }
//                 else if(document.getElementById(`node-${row}-${col}`).className === "node finish-node visited node-shortest-path"){
//                     // newGrid[row][col].className="node finish-node"; 
//                     document.getElementById(`node-${row}-${col}`).className = "node finish-node";
//                 } 
//                 else if((document.getElementById(`node-${row}-${col}`).className === "node visited node-shortest-path") || (document.getElementById(`node-${row}-${col}`).className === "node visited")){
//                     // newGrid[row][col].className="node";
//                     document.getElementById(`node-${row}-${col}`).className = "node";
//                 }
                
//             }
//         }
//         return newGrid;}



const initializeGrid=()=>{
    const grid=[]
    for (let row = 0; row < 21; row++) {
        const currentRow = [];
        for (let col = 0; col < 60; col++) {
          currentRow.push(getNode(row,col));
        }
        grid.push(currentRow);
      }
      return grid
}
const getNode=(row,col)=>{

    const type=row===startNodeRow&&col===startNodeCol?'start':
    row===finishNodeRow&&col===finishNodeCol?'finish':'normal-node'

    return{
        row,
        col,
        type,
        weightValue:1,
        isVisited: false,
        distance:Infinity,//djkstra
        gScore:Infinity,//astar
        fScore:Infinity,//astar
        hScore:null,//astar
        closed:false
    }
}

const getNewGridWithNewNodeType = (grid, row, col,newType) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
 
  const newNode = {
    ...node,
    // isWall:!node.isWall, 
    type:newType,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

//This function iterates trought the array and reuturns a node with a given type comment Me
const getNodeByType =(grid,givenType)=>{
  
    for (const row of grid) {
        for (const node of row) {
           if(node.type===givenType){
               return node;
           }
        }
      }
}

  
  
function changeAlgoritmSpeed(speed){
    algorithmSpeed=speed
}
