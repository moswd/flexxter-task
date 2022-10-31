import { CHANGE_TASK_STATUS_URL, GET_TASKS_URL } from '../config'
import data from '../repository/data.json'
import { Task } from '../repository/domain'

interface HashMap<T> {
    [key: string]: string | number | boolean | T
}

export function interceptRequests() {
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        console.log(`intercepted a request for ${input}`)

        // simulate response delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const url = input.toString()

        if ( url.startsWith(GET_TASKS_URL) ) {
            const id = Number(url.split('?')?.[1].split('=')?.[1])

            if ( isNaN(id) ) {
                return generateResponse(
                    undefined, 
                    { status: 404, statusText: 'Not Found' }
                )
            }

            const tasks = data.projects.find(project => project.id === id)?.tasks

            if ( !tasks ) {
                return generateResponse(
                    undefined, 
                    { status: 404, statusText: 'Not Found' }
                )
            }

            return generateResponse<Task[]>(
                { tasks },
                { status: 200, statusText: 'OK' }
            )
        }

        if ( url.startsWith(CHANGE_TASK_STATUS_URL) ) {
            if ( !init?.body ) {
                return generateResponse(
                    undefined,
                    { status: 422, statusText: 'Unprocessable Entity' }
                )
            }

            const body = JSON.parse(init?.body.toString())

            if ( body?.projectId && body?.taskId && typeof body?.checked === 'boolean' ) {
                return generateResponse(
                    { 'status': 'success' },
                    { status: 200, statusText: 'OK' }
                )
            }
        }


        return generateResponse({ 'error': 'NOT_SUPPORTED' })
    }
}

function generateResponse<T>(payload?: HashMap<T>, init?: ResponseInit) {
    const res = new Response(payload ? JSON.stringify(payload) : undefined, init)
    if ( payload ) res.json = async () => payload
    return res
}