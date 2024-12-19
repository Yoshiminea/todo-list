const { format } = require("date-fns");

const projectInput = document.querySelector(".new-item__input");
const project = document.querySelector(".project");
const submitButton = document.querySelector(".submit-button");

function localStorageF() {
  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
  function checkStorageAvailable() {
    if (storageAvailable("localStorage")) {
      console.log("available");
    } else {
      console.log("not available");
    }
  }
  function populateStorage(tasks) {
    localStorage.setItem("tasks", tasks);
  }
  function retrieveStorage() {
    return localStorage.getItem("tasks");
  }
  return {
    storageAvailable,
    checkStorageAvailable,
    populateStorage,
    retrieveStorage,
  };
}

projectInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const project = new Project(e.target.value);
    project.addProject();
    display.displayProjects(Project.projects);

    e.target.value = "";
  }
});
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title");

  const priority = document.querySelector("#priority");

  const date = document.querySelector("#date");

  const note = document.querySelector("#note");

  const newDateFormat = format(date.value, "MM / dd / yyyy");

  const task = new Task(
    Project.currentProject,
    title.value,
    newDateFormat,
    priority.value,
    note.value
  );
  task.pushTask();
});

// click on + to add project
function UI() {
  const addProject = (name) => {
    // Create a new project with the given name
    const project = new Project(name);
    project.addProject(); // Add the project to the static array
    project.displayProjects();
  };

  const addTaskButton = (
    project,
    title,
    description,
    dueDate,
    priority,
    notes
  ) => {
    const task = new Task(
      project,
      title,
      description,
      dueDate,
      priority,
      notes
    );
  };
  return { addProject, addTaskButton };
}

function Display() {
  function displayProjects(projects) {
    project.innerHTML = "";
    projects.forEach((item) => {
      const projectItem = document.createElement("div");
      projectItem.classList.add("project-item");
      project.appendChild(projectItem);

      const projectItemName = document.createElement("div");
      projectItemName.classList.add("project-item__name");
      projectItemName.textContent = item;
      projectItem.appendChild(projectItemName);

      const projectItemNumber = document.createElement("div");
      projectItemNumber.classList.add("project-item__number");
      projectItemNumber.textContent = 3;
      projectItem.appendChild(projectItemNumber);

      projectItem.addEventListener("click", () => {
        const projectName = document.querySelector(".tasks__title");
        projectName.textContent = Project.currentProject;
        const localStorageI = localStorageF();

        this.displayTasks(localStorageI.retrieveStorage());
      });
    });
  }

  function displayTasks(tasks) {
    const tasksContainerContainer = document.querySelector(
      ".tasks-container-container"
    );
    tasksContainerContainer.innerHTML = "";
    tasks.forEach((task) => {
      console.log(task.project);
      console.log(task.priority);
      console.log(task.dueDate);
      console.log(task.notes);

      console.log("Display Task");
      const tasksContainer = document.createElement("div");
      tasksContainer.classList.add("tasks-container");
      tasksContainerContainer.appendChild(tasksContainer);

      const container = document.createElement("div");
      container.classList.add("container");
      tasksContainer.appendChild(container);

      const tasksContainerTitle = document.createElement("div");
      tasksContainer.classList.add("tasks-container__title");
      tasksContainerTitle.textContent = task.title;
      container.appendChild(tasksContainerTitle);

      const details = document.createElement("div");
      details.classList.add("details");
      container.appendChild(details);

      const tasksContainerPriority = document.createElement("div");
      tasksContainerPriority.classList.add("tasks-container__priority");
      tasksContainerPriority.textContent = task.priority;
      details.appendChild(tasksContainerPriority);

      const tasksContainerDate = document.createElement("div");
      tasksContainerDate.classList.add("tasks-container__date");
      tasksContainerDate.textContent = task.dueDate;
      details.appendChild(tasksContainerDate);

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid");
      trashIcon.classList.add("fa-trash");
      tasksContainer.appendChild(trashIcon);

      trashIcon.addEventListener("click", () => {
        Task.removeTask();
        debugger;
        displayTasks(Task.tasks);
      });

      tasksContainer.addEventListener("click", () => {});
    });
  }
  return { displayProjects, displayTasks };
}

class Project {
  static projects = ["default"]; // Static array to hold all projects
  static currentProject = "default";
  constructor(name) {
    this.name = name; // Set the project name
  }
  addProject() {
    Project.projects.push(this.name); // Add the project name to the static array
    Project.currentProject = this.name;
  }
  displayProjects() {
    console.log(Project.projects);
  }
  displayName() {
    console.log(this.name);
  }
}

class Task {
  static tasks = [];

  constructor(
    project = "default",
    title,
    dueDate,
    priority = "low",
    notes = ""
  ) {
    this.project = project;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
  pushTask() {
    Task.tasks.push({
      project: this.project,
      title: this.title,
      dueDate: this.dueDate,
      priority: this.priority,
      notes: this.notes,
    });
    const localStorageI = localStorageF();
    localStorageI.populateStorage(Task.tasks);

    console.log(Task.tasks);
  }
  static removeTask() {
    Task.tasks.pop();
    console.log(Task.tasks);
  }
  static get getTasks() {
    return Task.tasks;
  }
  a() {
    return Task.tasks;
  }
}

// Create the UI instance
const ui = UI();
const display = Display();

// Add a project with a name

ui.addTaskButton();
// debugger;
// display.displayTasks(Task.getTasks());
