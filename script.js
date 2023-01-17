const inputTask = document.getElementById("inputField");
const inputPriority = document.getElementById("priorityList");

const taskList = document.getElementById("taskContainer");

let taskId = 0;


/* ***** create database array containing task objects, followed by its methods ***** */

const Database = {
    array: []
};

//create and return a new task object
Database.add = function () {
    let taskDescription = inputTask.value;
    let taskPriority = inputPriority.value;
    let newTask = new Task(taskDescription, taskPriority, false);
    console.log(newTask);
    this.array.push(newTask);
    Database.display();
    console.log(Database.array);
}

Database.display = function () {
    clearTaskList()
    let priorityClass;
    for (let i = 0; i <= Database.array.length - 1; i++) {
        switch (Database.array[i].priorityLevel) {
            case "high":
                console.log("high");
                priorityClass = "priorityHigh";
                break;
            case "moderate":
                console.log("med");
                priorityClass = "priorityModerate";
                break;
            case "low":
                console.log("low");
                priorityClass = "priorityLow";
                break;
            default:
                console.log("def");
                priorityClass = "priorityModerate";
                break;
        }
        let currentTask = document.createElement("span");
        currentTask.classList.add("taskName", priorityClass);
        currentTask.textContent = (Database.array[i].taskName);

        let doneButton = document.createElement("button");
        doneButton.classList.add("taskDone");
        doneButton.textContent = "Done";
        //doneButton.onclick = taskIsDone();

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("taskdelete");
        deleteButton.textContent = "remove";
        //deleteButton.onclick = taskDelete();

        let newLi = document.createElement("li");

        newLi.append(currentTask, doneButton, deleteButton);
        taskList.appendChild(newLi)
    }
}


/* ***** Task object constructor followed by task object methods ***** */

function Task(name, priority, bool = false) {
    this.taskName = name;
    this.priorityLevel = priority;
    this.isDone = bool;
}

/*function taskIsDone(){
    let parentItemList=this.parentElement
}*/

function clearTaskList() {
    taskList.innerHTML = "";
}

Database.display();
