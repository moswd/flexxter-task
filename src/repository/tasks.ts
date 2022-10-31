import { CHANGE_TASK_STATUS_URL, GET_TASKS_URL } from '../config'
import { Task } from './domain'

export async function getTasksByProjectId(id: number): Promise<Task[]> {
    try {
        let res = await fetch(`${GET_TASKS_URL}?id=${id}`)
        let json = await res.json()
        return json.tasks
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function changeTaskStatus(
    projectId: number, 
    taskId: number, 
    checked: boolean
): Promise<boolean> {
    try {
        let res = await fetch(
            CHANGE_TASK_STATUS_URL, 
            {
                method: 'POST',
                body: JSON.stringify({ projectId, taskId, checked })
            }
        )

        let json = await res.json()

        return json.status === 'success' 
    } catch (e) {
        return Promise.reject(e)
    }
}