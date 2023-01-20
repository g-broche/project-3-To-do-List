const inputTask = document.getElementById("textField");
const inputPriority = document.getElementById("priorityList");
const inputdDateField = document.getElementById("newTaskDate");
const addTaskButton = document.getElementById("addTaskButton");
const saveTasksButton = document.getElementById("saveTasksButton");
const taskList = document.getElementById("taskContainer");

const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];


/* ***** setting eventlistener of native elements ***** */

inputTask.addEventListener("input", function () { enableAddButton() });
addTaskButton.addEventListener("click", function () { addNewTask() });
saveTasksButton.addEventListener("click", function () { storeTaskList() });

/* ***** create database array containing task objects, followed by its methods ***** */

const Database = {
    array: []
};

//creates and adds a new task object in the Database
Database.add = function (desc, priority, date) {
    let newTask = new Task(desc, priority, date);
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
    Database.sort();
    Database.sortByDate();

    let previousDate;

    for (let i = 0; i <= this.array.length - 1; i++) {
        let spanContainer = document.createElement("div");
        let currentTask = document.createElement("span");   //creates span element containing task description
        let doneButton = document.createElement("button");  //creates button to say a task is done
        let deleteButton = document.createElement("button");  //creates button to remove a task
        let newLi = document.createElement("li");   //adds span and buttons to a newly <li> element and then add the <li> to the existing <ul>
        let priorityClass;

        //checks if first entry or a different task.deadline than previous loop iteration, if yes then append a separating div and text to the task UL
        if ((i == 0 && this.array[0] != undefined) || (this.array[i].deadline) != previousDate) {
            let dateContainer = document.createElement("div");
            dateContainer.classList.add("divDate")
            let datetitle = document.createElement("h2");
            datetitle.classList.add("titleDate")
            let taskDeadline = new Date(this.array[i].deadline);
            datetitle.textContent = taskDeadline.getDate() + " " + months[taskDeadline.getMonth()] + " " + taskDeadline.getFullYear();
            dateContainer.appendChild(datetitle);
            taskList.appendChild(dateContainer);

        }

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

        if (this.array[i].isDone) {             //checks if task is done or not to apply proper classes
            currentTask.classList.add("taskName");
            doneButton.classList.add("doneButton", "doneButtonDone");
            newLi.classList.add(priorityClass, "done");
        } else {
            currentTask.classList.add("taskName");
            doneButton.classList.add("doneButton", "doneButtonToDo");
            newLi.classList.add(priorityClass);
        }
        //assign content and event listener triggers with corresponding functions to the html elements that will be added
        currentTask.textContent = (this.array[i].taskName);
        currentTask.addEventListener("click", function (e) { enableTaskEdit(e) });
        currentTask.addEventListener("focusout", function (e) { changeTaskName(e, i) });

        doneButton.innerHTML = "&check;";
        doneButton.addEventListener("click", function () { changeTaskStatus(i) });

        let trashbinSVG = new Image();
        trashbinSVG.src = "Resources/trash.svg";
        trashbinSVG.alt = "trashbinIcon";
        trashbinSVG.classList.add("center");

        deleteButton.classList.add("taskdelete");
        deleteButton.appendChild(trashbinSVG);
        deleteButton.addEventListener("click", function () { removeTask(i) });

        spanContainer.appendChild(currentTask); //append elements to their parents
        newLi.append(spanContainer, doneButton, deleteButton);
        taskList.appendChild(newLi);

        previousDate = this.array[i].deadline; //assign the deadline property of the current task to this variable to do a comparison in the next loop
    }
}

//specific rule to apply to the sorting method
function compareDates(a, b) {
    return Date.parse(new Date(a.deadline)) - Date.parse(new Date(b.deadline));
}

//sort database by deadline property of tasks
Database.sortByDate = function () {
    this.array.sort(compareDates);
}


//sorts the array contained inside the Database object based on priority level of task objects and if the tasks are done
Database.sort = function () {
    let tempBase = []; //temp array used to collect the task objects during the sorting

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
    this.array = [...tempBase]; //assigning the sorted temp array as new value for the Database array.
}

//use an index to remove a task from database
Database.deleteTask = function (index) {
    this.array.splice(index, 1);
}


/* ***** Task object constructor followed by task object methods ***** */

function Task(name, priority, date) {
    this.taskName = name;
    this.priorityLevel = priority;
    this.deadline = date;
    this.isDone = false;
}

/* ***** functions ***** */

//disable or enable the add button based on if the task input field is empty or not
function enableAddButton() {
    if (inputTask.value == "") {
        addTaskButton.disabled = true;
    } else {
        addTaskButton.disabled = false;
    }
}

//fill date input based on the current date
function fillDateInput() {
    let date = new Date();
    inputdDateField.valueAsDate = date;
    inputdDateField.min = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
    inputdDateField.max = date.getFullYear() + 1 + "-" + date.getMonth() + 1 + "-" + date.getDate();
}

//checks if a date is included between two other dates
function isDateAllowed(d, min, max) {
    return ((min <= d && d <= max) ? true : false);
}

//make a task name editable on click
function enableTaskEdit(e) {
    e.target.setAttribute("contenteditable", "true");
    e.target.setAttribute("maxlength", "100");
    e.target.classList.add("editable");
}

//changes the name of the task in database based on text content when focus is lost
function changeTaskName(e, index) {
    if (e.target.textContent != "") {
        Database.array[index].taskName = e.target.textContent;
        Database.display();
    } else {
        e.target.textContent = Database.array[index].taskName;
    }
    e.target.classList.remove("editable");
}

//adds a new task to the Database based on input fields, sort the database and display it
function addNewTask() {

    if (inputTask.value != "") {
        let newTask = inputTask.value;
        let newTaskPriority = inputPriority.value;
        let newTaskDate = inputdDateField.value;
        console.log("new date = " + newTaskDate + "; min = " + inputdDateField.min + "; max = " + inputdDateField.max)
        if (isDateAllowed(newTaskDate, inputdDateField.min, inputdDateField.max)) {
            let taskExistsAt = Database.doesTaskExist(newTask);
            if (taskExistsAt == -1) {
                Database.add(newTask, newTaskPriority, newTaskDate);
                Database.display();
            } else {
                Database.TaskExistError(taskExistsAt);
            }
        } else {
            inputdDateField.value = inputdDateField.min;
        }
        inputTask.value = "";
        enableAddButton();
    }
}

//on <done> button click, uses an index for parameter to target corresponding task and Database, sets the isDone boolean of said task to the opposite value.
function changeTaskStatus(taskIndex) {
    Database.array[taskIndex].isDone = (Database.array[taskIndex].isDone ? false : true);
    Database.display();
}

// on <remove> button click, uses an index for parameter to target corresponding task and removes it from Database object.
function removeTask(taskIndex) {
    Database.deleteTask(taskIndex);
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


enableAddButton();
fillDateInput();
fillDataOnLoad();
Database.display();
