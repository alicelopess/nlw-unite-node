import fastify from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const app = fastify()

//DB Conection
const prisma = new PrismaClient({
    log: ['query'],
})

app.get('/', () => {
    return 'Hello, NLW Unite!'
})

//Create event
app.post('/events', async (request, reply) => {
    
    const createEventSchema = z.object({
        title: z.string().min(4, { message: "Must be 5 or more characters long" }),
        details: z.string().max(100, { message: "Must be 100 or fewer characters long" }).nullish(),
        maximunAttendees: z.number().int().positive().nullish(),
    })

    //Validation
    const eventData = createEventSchema.parse(request.body)

    //Implement on DB
    const createdEvent = await prisma.event.create({
        data: {
            title: eventData.title,
            details: eventData.details,
            maximunAttendees: eventData.maximunAttendees,
            slug: new Date().toISOString(),
        },
    })

    return reply.status(201).send({ eventId: createdEvent.id })
})

app.listen({ port: 3333 })
    .then(() => console.log('HTTP Server Running!'))