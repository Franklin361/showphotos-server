export function isCorrectInputs( variables: any ) {
    let input = ''
    
      for (let value of Object.entries(variables)) {
          if (!value[1]) {
             input = value[0]          
          };
      }
      return input
  };
  
