let todoArray=[];
 
function saveTask(){
    let taskName = document.getElementById("txtItem").value;
    let todoObj = {
        taskId: todoArray.length + 1 ,
        taskName: taskName
    }
todoArray.push(todoObj);
}
function 