const inputTask = document.getElementById("inputField");
const inputPriority = document.getElementById("priorityList");

const taskList = document.getElementById("taskContainer");

let taskId = 0;


/* ***** create database array containing task objects, followed by its methods ***** */

const Database = {
    array: []
};

//creates and adds a new task object in the Database
Database.add = function () {
    let taskDescription = inputTask.value;
    let taskPriority = inputPriority.value;
    let newTask = new Task(taskDescription, taskPriority, false);
    this.array.push(newTask);
    Database.display();
}

Database.display = function () {
    clearTaskList()
    let priorityClass;
    for (let i = 0; i <= this.array.length - 1; i++) {
        switch (this.array[i].priorityLevel) {
            case "high":
                priorityClass = "priorityHigh";
                break;
            case "moderate":
                priorityClass = "priorityModerate";
                break;
            case "low":
                priorityClass = "priorityLow";
                break;
            default:
                priorityClass = "default";
                break;
        }
        let currentTask = document.createElement("span");
        if (this.array[i].isDone) {
            currentTask.classList.add("taskName", "done", priorityClass);
        } else {
            currentTask.classList.add("taskName", priorityClass);
        }
        currentTask.textContent = (this.array[i].taskName);

        let doneButton = document.createElement("button");
        doneButton.classList.add("taskDone");
        doneButton.textContent = "Done";
        doneButton.onclick = taskIsDone;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("taskdelete");
        deleteButton.textContent = "remove";
        //deleteButton.onclick = taskDelete;

        let newLi = document.createElement("li");

        newLi.append(currentTask, doneButton, deleteButton);
        taskList.appendChild(newLi)
    }
}

Database.sort = function () {
    let tempBase = [];
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "high") && (!this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "moderate") && (!this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "low") && (!this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "high") && (this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "moderate") && (this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    for (let i = 0; i <= this.array.length - 1; i++) {
        if ((this.array[i].priorityLevel == "low") && (this.array[i].isDone)) {
            tempBase.push(this.array[i]);
        }
    }
    this.array = [...tempBase];
}


/* ***** Task object constructor followed by task object methods ***** */

function Task(name, priority, bool = false) {
    this.taskName = name;
    this.priorityLevel = priority;
    this.isDone = bool;
}

/* ***** functions ***** */

//using an element as parameter, gets and returns the index of the corresponding list item inside the parent unordered list.
function getIndexFromButtonPush(trigger) {
    let listItem = trigger.parentElement;
    let parentList = listItem.parentElement;
    let index = Array.from(parentList.children).indexOf(listItem);
    return index;
}

//on <done> button click, gets name of the task, compare it to the list of tasks and line through the task in question.
function taskIsDone() {
    let taskIndex = getIndexFromButtonPush(this);
    Database.array[taskIndex].isDone = true;
    Database.sort();
    Database.display();
}

function clearTaskList() {
    taskList.innerHTML = "";
}

Database.display();
