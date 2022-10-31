import { TaskComponent } from '../components/task'
import { TasksListComponent } from '../components/tasksList'

export function registercComponents() {
    customElements.define('f-tasks-list', TasksListComponent)
    customElements.define('f-task', TaskComponent)
}