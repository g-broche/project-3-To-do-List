const inputTask = document.getElementById("inputField");
const inputPriority = document.getElementById("priorityList");
const inputdDateField = document.getElementById("newTaskDate");

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

//checks if task already exists in collection, returns index if yes or -1 otherwise
Database.doesTaskExist = function (desc) {
    for (let i = 0; i <= this.array.length - 1; i++) {
        if (this.array[i].taskName == desc) {
            return i;
        }
    }
    return -1;
}

//if user enter new task with an already existing name, display an alert. require task index.
Database.TaskExistError = function (taskIndex) {
    alert("the task called \"" + this.array[taskIndex].taskName + "\" already exists in the list at this time!");
}

//displays the tasks contained in the Database
Database.display = function () {
    clearTaskList()

    for (let i = 0; i <= this.array.length - 1; i++) {
        let spanContainer = document.createElement("div");
        let currentTask = document.createElement("span");   //creates span element containing task description
        let doneButton = document.createElement("button");  //creates button to say a task is done
        let deleteButton = document.createElement("button");  //creates button to remove a task
        let newLi = document.createElement("li");   //adds span and buttons to a newly <li> element and then add the <li> to the existing <ul>
        let priorityClass;
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

        if (this.array[i].isDone) {
            currentTask.classList.add("taskName");
            doneButton.classList.add("doneButton", "doneButtonDone");
            newLi.classList.add(priorityClass, "done");
        } else {
            currentTask.classList.add("taskName");
            doneButton.classList.add("doneButton", "doneButtonToDo");
            newLi.classList.add(priorityClass);
        }
        currentTask.textContent = (this.array[i].taskName);
        doneButton.innerHTML = "&check;";
        doneButton.onclick = changeTaskStatus;

        let trashbinSVG = new Image();
        trashbinSVG.src = "Resources/trash.svg"
        trashbinSVG.alt = "trashbinIcon"
        trashbinSVG.classList.add("center")

        deleteButton.classList.add("taskdelete");
        deleteButton.appendChild(trashbinSVG);
        deleteButton.onclick = removeTask;

        spanContainer.appendChild(currentTask);
        newLi.append(spanContainer, doneButton, deleteButton);
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

//fill date input based on the current date
function fillDateInput() {
    let date = new Date();
    let maxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    console.log(date)
    console.log(maxDate)
    inputdDateField.valueAsDate = date;
    inputdDateField.minAsDate = date;
    inputdDateField.max = date.getFullYear() + 1 + "-" + date.getMonth() + 1 + "-" + date.getDate();
    //inputdDateField.maxAsDate = maxDate;
}



//using an element as parameter, gets and returns the index of the corresponding list item inside the parent unordered list.
function getIndexFromButtonPush(trigger) {
    let listItem = trigger.parentElement;
    let parentList = listItem.parentElement;
    let index = Array.from(parentList.children).indexOf(listItem);
    return index;
}

//adds a new task to the Database based on input fields, sort the database and display it
function addNewTask() {
    let newTask = inputTask.value;
    let newTaskPriority = inputPriority.value;
    let taskExistsAt = Database.doesTaskExist(newTask);
    if (taskExistsAt == -1) {
        Database.add(newTask, newTaskPriority);
        Database.sort();
        Database.display();
    } else {
        Database.TaskExistError(taskExistsAt);
    }
}

//on <done> button click, gets index of task to be crossed and compare it to the list of tasks and line through the task in question.
function changeTaskStatus() {
    let taskIndex = getIndexFromButtonPush(this);
    Database.array[taskIndex].isDone = (Database.array[taskIndex].isDone ? false : true);
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

// clears task list <ul> of all its children
function clearTaskList() {
    taskList.innerHTML = "";
}

// stores the Database object into the local storage
function storeTaskList() {
    localStorage.clear();
    window.localStorage.setItem("saveDB", JSON.stringify(Database.array));
}

//gets the savedDB local storage and copies it inside Database.array
function fillDataOnLoad() {
    let savedDB = JSON.parse(localStorage.getItem('saveDB') || "[]");
    Database.array = [...savedDB];
}



fillDateInput();
console.log(inputdDateField.max);
fillDataOnLoad();
Database.display();
