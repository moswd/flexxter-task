import { Task } from "../repository/domain"
import { getTasksByProjectId } from "../repository/tasks"

export class TasksListComponent extends HTMLElement {
    wrapperEl!: HTMLDivElement
    contentWrapperEl!: HTMLDivElement
    titleEl!: HTMLHeadElement
    loadingEl!: HTMLDivElement

    tasks: Task[] = []
    isLoading = true
    hasError = false

    projectId?: number;

    constructor() {
        super()
    }

    async fetchTasks() {
        this.isLoading = true
        this.loadingEl.classList.remove('hide')

        if ( this.projectId !== undefined ) {
            try {
                const tasks = await getTasksByProjectId(this.projectId)
                this.tasks = tasks
                this.renderTasks()
            } catch ( e ) {
                // TODO should display error message
                this.hasError = true
            } finally {
                this.isLoading = false
                this.loadingEl.classList.add('hide')
            }
        }
    }

    mount() {
        this.wrapperEl = document.createElement('div')
        this.wrapperEl.setAttribute('class', 'wrapper')

        this.contentWrapperEl = document.createElement('div')
        this.contentWrapperEl.setAttribute('class', 'content-wrapper')

        this.titleEl = document.createElement('h3')
        this.titleEl.setAttribute('class', 'title')
        this.titleEl.textContent = 'Tasks'

        this.loadingEl = document.createElement('div')
        this.loadingEl.setAttribute('class', 'spinner-wrapper')

        this.contentWrapperEl.append(this.loadingEl)
        this.wrapperEl.append(this.titleEl, this.contentWrapperEl)

        this.shadowRoot!.append(this.wrapperEl)
    }

    updateState() {
        const projectId = Number(this.getAttribute('project-id'))
        this.projectId = isNaN(projectId) ? undefined : projectId
    }

    bindStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                width: 360px;
            }

            .title {
                font-weight: normal;
            }

            .content-wrapper {
                position: relative;
                min-height: 240px;
            }

            .spinner-wrapper {
                position: absolute;
                inset: 0;
                background-color: #fafafa;
            }

            .spinner-wrapper::after {
                content: '';
                position: absolute;
                inset: 0;
                margin: auto;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid #333;
                border-left-color: transparent;
                animation: rotate 1s linear infinite;
            }

            .spinner-wrapper.hide {
                display: none;
            }

            @keyframes rotate {
                to { transform: rotate(360deg); }
            }

            @media (prefers-color-scheme: dark) {
                .spinner-wrapper {
                    background-color: #242424;
                }

                .spinner-wrapper::after {
                    border-color: #666;
                    border-left-color: transparent;
                }
            }
        `;

        this.shadowRoot!.append(style)
    }

    renderTasks() {
        if ( this.projectId === undefined ) return

        const taskElements: HTMLElement[] = []

        this.tasks.forEach(task => {
            const temp = document.createElement('f-task')
            temp.setAttribute('project-id', this.projectId!.toString())
            temp.setAttribute('task-id', task.id.toString())
            temp.setAttribute('task-title', task.title)
            temp.setAttribute('task-description', task.description)
            temp.setAttribute('task-done', task.checked.toString())

            taskElements.push(temp)
        })

        console.log(taskElements)

        this.contentWrapperEl.append(...taskElements)
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' })

        this.mount()
        this.updateState()
        this.bindStyles()
        this.fetchTasks()
    }
}