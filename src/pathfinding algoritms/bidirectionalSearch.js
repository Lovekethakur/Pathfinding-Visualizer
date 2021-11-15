export function bidirectionalSearch(grid, startNode, finishNode) {
  if(!startNode || !finishNode || startNode === finishNode)
      return false

  const visitedNodes = []
  const queue1 = [startNode]
  const queue2 = [finishNode]
  while(queue1.length !== 0 && queue2.length !== 0){
      const fromStart = queue1.shift()
      const fromFinish = queue2.shift()
      if(fromFinish.isVisited){
          console.log(fromFinish)
          visitedNodes.push(fromFinish)
          return visitedNodes
      }
      if(fromStart.isVisitedFromOther){
          console.log(fromStart)
          visitedNodes.push(fromStart)
          return visitedNodes
      }
      if(fromStart === fromFinish){
          return visitedNodes
      }

      if(fromStart.isVisited && fromFinish.isVisitedFromOther) 
          continue
      else if(fromStart.isVisited){
          fromFinish.isVisitedFromOther = true;
          visitedNodes.push(fromFinish)
          const finishNeighbours = getNeighbours(grid, fromFinish, 'from_finish')
          for(const neighbour of finishNeighbours){
              neighbour.nextNode = fromFinish
              queue2.push(neighbour)
          }
      }else if(fromFinish.isVisitedFromOther){
          fromStart.isVisited = true
          visitedNodes.push(fromStart)
          const startNeighbours = getNeighbours(grid, fromStart, 'from_start')
          for(const neighbour of startNeighbours){
              neighbour.previousNode = fromStart
              queue1.push(neighbour)
          }
      } else{
          fromFinish.isVisitedFromOther = true
          visitedNodes.push(fromFinish)
          const finishNeighbours = getNeighbours(grid, fromFinish, 'from_finish')
          for(const neighbour of finishNeighbours){
              neighbour.nextNode = fromFinish
              queue2.push(neighbour)
          }
          fromStart.isVisited = true
          visitedNodes.push(fromStart)
          const startNeighbours = getNeighbours(grid, fromStart, 'from_start')
          for(const neighbour of startNeighbours){
              neighbour.previousNode = fromStart
              queue1.push(neighbour)
          }
      }

  }
  return visitedNodes
}

function getNeighbours(grid, node, direction){
  const neighbours = []
  const {row, col} = node
  if(row > 0) neighbours.push(grid[row - 1][col])
  if(row < grid.length - 1) neighbours.push(grid[row + 1][col])
  if(col > 0) neighbours.push(grid[row][col - 1])
  if(col < grid[0].length - 1) neighbours.push(grid[row][col + 1])

  if(direction === 'from_start')
      return neighbours.filter(neighbour => !neighbour.isVisited && !neighbour.isWall)
  return neighbours.filter(neighbour => !neighbour.isVisitedFromOther && !neighbour.isWall)
}
export function getBidirectionalShortestPath(middle1 , finishNode){
  const pathList = []
  const path1 = []
  const path2 = []
  
  while(middle1 !== null){
    //   middle1.isPath = true
      path1.unshift(middle1)
      if(middle1 !== undefined){
      middle1 = middle1.previousNode
  }   else {
    let middle2 = middle1;
    while(middle2 !== null){
        //   middle2.isPath = true
          path2.push(middle2)
          if(middle2 !==undefined){
          middle2 = middle2.nextNode}
          else{
            return path1.concat(path2)
          }
      }
  }
}

  

  
}