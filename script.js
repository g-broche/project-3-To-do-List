const inputTask = document.getElementById("inputField");
const inputPriority = document.getElementById("priorityList");

const taskList = document.getElementById("taskContainer");


/* ***** create database array containing task objects, followed by its methods ***** */

const Database = {
    array: []
};

//creates and adds a new task object in the Database
Database.add = function (desc, priority) {
    let newTask = new Task(desc, priority, false);
    this.array.push(newTask);
}

//displays the tasks contained in the Database
Database.display = function () {
    clearTaskList()
    let priorityClass;
    for (let i = 0; i <= this.array.length - 1; i++) {
        switch (this.array[i].priorityLevel) {  //checks priority of task to attribute class and display corresponding color
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
                priorityClass = "priorityModerate";
                break;
        }
        let currentTask = document.createElement("span");   //creates span element containing task description
        if (this.array[i].isDone) {
            currentTask.classList.add("taskName", "done", priorityClass);
        } else {
            currentTask.classList.add("taskName", priorityClass);
        }
        currentTask.textContent = (this.array[i].taskName);

        let doneButton = document.createElement("button");  //creates button to say a task is done
        doneButton.classList.add("taskDone");
        doneButton.textContent = "Done";
        doneButton.onclick = taskIsDone;

        let deleteButton = document.createElement("button");  //creates button to remove a task
        deleteButton.classList.add("taskdelete");
        deleteButton.textContent = "remove";
        deleteButton.onclick = removeTask;

        let newLi = document.createElement("li");   //adds span and buttons to a newly <li> element and then add the <li> to the existing <ul>
        newLi.append(currentTask, doneButton, deleteButton);
        taskList.appendChild(newLi)
    }
}


//sorts the array contained inside the Database object based on priority level of task objects and if the tasks are done
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

//use an index to remove a task from database
Database.deleteTask = function (index) {
    this.array.splice(index, 1);
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

//adds a new task to the Database based on input fields, sort the database and display it
function addNewTask() {
    Database.add(inputTask.value, inputPriority.value);
    Database.sort();
    Database.display();
}

//on <done> button click, gets index of task to be crossed and compare it to the list of tasks and line through the task in question.
function taskIsDone() {
    let taskIndex = getIndexFromButtonPush(this);
    Database.array[taskIndex].isDone = true;
    Database.sort();
    Database.display();
}

// on <remove> button click, gets index of task to be removed and compare it to the list of tasks and remove it from Database object.
function removeTask() {
    let taskIndex = getIndexFromButtonPush(this);
    Database.deleteTask(taskIndex);
    Database.sort();
    Database.display();
}

// clear task list <ul> of all its children
function clearTaskList() {
    taskList.innerHTML = "";
}

Database.display();
