function createTask(container, id, disablePlaceHolder) {
    const html = '<input type="checkbox"> <span class="label" contenteditable="true">'+(disablePlaceHolder ? '' : '<span class="placeholder">Type the task title here</span>')+'</span>'
    const li = document.createElement('li')
    li.id = id
    li.innerHTML = html
    container.prepend(li)

    const data = {
        li: li,
        checkbox: document.querySelector(`#${id} > input`),
        label: document.querySelector(`#${id} > span`)
    }
    
    const update = () => {
        save()
    }
    data.checkbox.onchange = update

    data.label.onkeydown = (event) => {
        const placeholder = document.querySelector(`#${id} .placeholder`)
        data.label.removeChild(placeholder)
        data.label.onkeydown = null
    }

    data.label.addEventListener('focusout', () => {
        if (data.label.innerText.trim().length === 0) {
            container.removeChild(li)
        }
        update()
    })

    save()
    return data
}

var taskid = 0
var newTaskId = () => ('task_' + taskid++)
const taskList = document.querySelector('ul')
const addTaskButton = document.querySelector('.float-action-button')
addTaskButton.onclick = addTask

load()

function addTask() {
    createTask(taskList, newTaskId())
}

function load() {
    if (window.localStorage) {
        if (window.localStorage.taskid) {
            taskid = parseInt(window.localStorage.taskid)
        }

        if (window.localStorage.tasks) {
            const tasks = JSON.parse(window.localStorage.tasks)
            var tasksAsArray = []
            for (const index in tasks) {
                const task = tasks[index]
                tasksAsArray.push({
                    id: index,
                    checked: task.checked,
                    label: task.label
                })
            }
            tasksAsArray = tasksAsArray.sort((a, b) => {
                return b.id > a.id ? -1 : 1
            })

            for (let i = 0; i < tasksAsArray.length; i++) {
                const task = tasksAsArray[i]
                const data = createTask(taskList, task.id, true)
                data.checkbox.checked = task.checked
                data.label.innerText = task.label
            }
        }
    }
}

function save() {
    const tasks = {}
    taskList.childNodes.forEach((taskNode) => {
        const checked = document.querySelector('#' + taskNode.id + ' input').checked
        const label = document.querySelector('#' + taskNode.id + ' .label').innerText
        tasks[taskNode.id] = {
            checked: checked,
            label: label
        }
    })

    window.localStorage.taskid = taskid.toString()
    window.localStorage.tasks = JSON.stringify(tasks)
}