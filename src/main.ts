// import { changeTaskStatus, getTasksByProjectId } from './repository/tasks'
import { CHANGE_TASK_STATUS_URL, GET_TASKS_URL } from './config'
import { interceptRequests } from './boot/interceptRequests'
import { registercComponents } from './boot/registerComponents'
import './style.css'

interceptRequests()
registercComponents()


// const res = await getTasksByProjectId(1)
// console.log(res)

// const res2 = await changeTaskStatus(1, 3, false)
// console.log(res2)

