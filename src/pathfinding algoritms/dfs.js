export function dfs(grid,startNode,finishNode){
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
      }
    // console.log("hey");
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
      unvisitedNodes.push(startNode);
      while (unvisitedNodes.length !== 0) {
        let closestNode = unvisitedNodes.shift();
        if (closestNode.type=== "wall") continue;
        if (closestNode === finishNode) return visitedNodesInOrder;
        visitedNodesInOrder.push(closestNode);
        closestNode.isVisited = true;
        let unvisitedNeighbours = getUnvisitedNeighbours(closestNode, grid);
        for (let unvisitedNeighbour of unvisitedNeighbours) {
          unvisitedNeighbour.previousNode = closestNode;
          unvisitedNodes.unshift(unvisitedNeighbour);
        }
      }
      return visitedNodesInOrder;
}



function getUnvisitedNeighbours(node, grid) {
    // console.log("No");
    const neighbours = [];
    const { row, col } = node;
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (row > 0) neighbours.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);

    return neighbours.filter((neighbour) => !neighbour.isVisited);
  }

export function getShortestDFSPath(finishNode){
    // console.log("hello");
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      if(currentNode!==undefined){
      currentNode = currentNode.previousNode;
    } else{
      return nodesInShortestPathOrder;
    }
  }
    
}

