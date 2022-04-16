import calFunction from "./CalculateFuntion"

function calculateFalsePosition(equation, xl, xr, epsilon){

    let dataError = []
    let dataAnswer = []
    let x1 = 0
    let c = 1
    let temp = 0
    let objTable = []
    let round = 1

    const columnsTemp = [
        { 
            field: 'id',
            headerName: 'ID', 
            width: 70,
            type: 'number',
            editable: false,
            sortable: false,
        },
        {
            field: 'xl',
            headerName: 'Left',
            width: 150,
            type: 'number',
            editable: false,
            sortable: false,
        },
        {
            field: 'xr',
            headerName: 'Right',
            width: 150,
            type: 'number',
            editable: false,
            sortable: false,
        },
        {
            field: 'x',
            headerName: 'X',
            width: 150,
            type: 'number',
            editable: false,
            sortable: false,
        },
        {
            field: 'error',
            headerName: 'Error',
            width: 150,
            type: 'number',
            editable: false,
            sortable: false,
        }
      ];
    
    objTable.push(columnsTemp);

    while(c>epsilon){

        console.log("Iteration ",round)
        let fx1 = calFunction(equation, x1)
        let fxl = calFunction(equation, xl)
        let fxr = calFunction(equation, xr)

        x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)
        dataAnswer.push({answer:x1})
        
        if (fx1*fxr > 0){
            temp = xr
            xr = x1
        }
        else{
            temp = xl
            xl = x1
        }

        c = (x1-temp)/x1
        c = Math.abs(c)     
        
        if(!isFinite(c) || isNaN(c))
        {
            console.log("C is inf or NaN")
            dataError.push({value:1})    
        }
        else
        {
            dataError.push({value:c})
        }

        objTable.push({id:round, xl:xl, xr:xr, x:x1, error:c})
        round = round+1
    }

    console.log(objTable)
    return objTable;

}

export default calculateFalsePosition;