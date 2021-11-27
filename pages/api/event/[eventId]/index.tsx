import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const eventId = parseInt(req.query.eventId);
  const  event  = req.body;
  const session = await getSession({ req });
  console.log(event, eventId);
  switch (req.method) {
    case 'GET':
        return getEventById();
    case 'PUT':
        return updateEvent();
    case 'DELETE':
        return deleteEvent();
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getEventById() {
        prisma.event.findUnique({
            where: {
                id: eventId
            }
        }).then(event => {
            if (!event) {
                return res.status(404).end();
            }
            return res.json(event);
        }).catch(err => {
            console.error(err);
            return res.status(500).end();
        });
        }
    
    function updateEvent() { 
         prisma.event.update({
            where: {
                id: eventId
            },
            data: event
        }).then(event => {
                if (!event) {
                    return res.status(404).end();
                }
                return res.json(event);
            }
        ).catch(err => {
            console.error(err);
            return res.status(500).end();
        });
    }
    function deleteEvent() {
        prisma.event.delete({
            where: {
                id: eventId
            }}).then(event => {
                if (!event) {
                    return res.status(404).end();
                }
                return res.json(event);
            }).catch(err => {   
                console.error(err);
                return res.status(500).end();
            })
    }
}