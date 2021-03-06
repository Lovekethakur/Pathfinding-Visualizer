import './Node.css';
import React,{Component} from 'react'

export default class Node extends Component{
  
    render(){
        const {
            col,
            row,
            type,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            onMouseLeave
          } = this.props;

        const extraClassName=type==='start'?'start-node':
                             type==='finish'?'finish-node':
                             type==='wall'?'wall-node':
                             type==='weight'?'weight-node':
                             ""
                             

        
                           
        return ( <td
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`} 
        onMouseDown={()=>onMouseDown(row,col,type)}
        onMouseEnter={()=>onMouseEnter(row,col,type)}
        onMouseUp={()=>onMouseUp()}
        onMouseLeave={()=>onMouseLeave()}
        ></td>)
        
    }
}