import { changeTaskStatus } from '../repository/tasks'

export class TaskComponent extends HTMLElement {
    wrapperEl!: HTMLDivElement
    statusIconEl!: HTMLDivElement
    contentWrapperEl!: HTMLDivElement
    titleEl!: HTMLHeadElement
    descEl!: HTMLParagraphElement

    projectId?: number
    taskId?: number
    taskTitle?: string
    taskDescription?: string
    taskDone = true

    constructor(
        projectId?: number, 
        taskId?: number, 
        taskTitle?: string, 
        taskDescription?: string, 
        taskDone = true
    ) {
        super()

        this.projectId = projectId
        this.taskId = taskId
        this.taskTitle = taskTitle
        this.taskDescription = taskDescription
        this.taskDone = taskDone
    }

    async toggleTask() {
        // be omptimistic, people!
        this.taskDone = !this.taskDone
        this.updateIcon()

        if ( this.projectId !== undefined && this.taskId !== undefined ) {
            try {
                const changedStatusSuccessfully = await changeTaskStatus(this.projectId, this.taskId, this.taskDone)

                // if server responded with success: false
                if ( !changedStatusSuccessfully ) { 
                    throw new Error('oops!')
                }
            } catch (e) {
                // TODO should display error message
                // revert back to previus state
                this.taskDone = !this.taskDone
                this.updateIcon()
            }
        }
    }

    mount() {
        this.wrapperEl = document.createElement('div')
        this.wrapperEl.setAttribute('class', 'wrapper')
        this.wrapperEl.addEventListener('click', this.toggleTask.bind(this));

        this.statusIconEl = document.createElement('div')
        this.statusIconEl.setAttribute('class', 'icon')

        this.contentWrapperEl = document.createElement('div')
        this.contentWrapperEl.setAttribute('class', 'content-wrapper')

        this.titleEl = document.createElement('h4')
        this.titleEl.setAttribute('class', 'title')

        this.descEl = document.createElement('p')
        this.descEl.setAttribute('class', 'desc')

        this.contentWrapperEl.append(this.titleEl, this.descEl)
        this.wrapperEl.append(this.statusIconEl, this.contentWrapperEl)

        this.shadowRoot!.append(this.wrapperEl)
    }

    updateState() {
        const projectId = Number(this.getAttribute('project-id'))
        this.projectId = isNaN(projectId) ? this.projectId : projectId

        const taskId = Number(this.getAttribute('task-id'))
        this.taskId = isNaN(taskId) ? this.taskId : taskId

        this.taskTitle = this.hasAttribute('task-title') ? this.getAttribute('task-title')! : this.taskTitle
        this.taskDescription = this.hasAttribute('task-description') ? this.getAttribute('task-description')! : this.taskDescription
        this.taskDone = this.hasAttribute('task-done') ? this.getAttribute('task-done') === 'true' : this.taskDone

        if ( this.taskTitle ) {
            this.titleEl.innerText = this.taskTitle
            this.titleEl.title = this.taskTitle
        }

        if ( this.taskDescription ) {
           this.descEl.innerText = this.taskDescription 
           this.descEl.title = this.taskDescription 
        } 

        this.updateIcon()
    }

    bindStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                margin-top: 8px;
                width: 360px;
                height: 80px;
                background-color: #fff;
                box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.03);
                border: 1px solid rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                display: flex;
                cursor: pointer;
                transition: background-color 0.25s;
            }

            .icon {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background-color: #fafafa;
                color: #fff;
                margin: 8px;
                flex: none;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                text-transform: uppercase;
                user-select: none;
                transition: all 0.25s;
            }

            .wrapper.checked .icon {
                background-color: #48c275;
            }

            .content-wrapper {
                min-width: 0;
                display: flex;
                flex-direction: column;
            }

            .title {
                margin: 16px 0 0 0;
                font-weight: normal;
            }
            
            .desc {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 13px;
                margin: auto 16px 16px 0;
                color: #637382;
            }

            .wrapper.checked .desc {
                text-decoration: line-through;
            }

            @media (prefers-color-scheme: dark) {
                .wrapper {
                    background-color: #1e1e1e;
                }

                .icon {
                    background-color: #191919;
                }

                .wrapper.checked .icon {
                    background-color: #48c275;
                }
            }
        `;

        this.shadowRoot!.append(style)
    }

    updateIcon() {
        this.statusIconEl.textContent = this.taskDone ? 'Done' : ''

        if ( this.taskDone ) {
            this.wrapperEl.setAttribute('class', 'wrapper checked')
        } else {
            this.wrapperEl.setAttribute('class', 'wrapper unchecked')
        }
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' })

        this.mount()
        this.updateState()
        this.bindStyles()
    }
}