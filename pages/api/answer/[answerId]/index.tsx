import prisma from "../../../../lib/prisma";
import get from "lodash/get";

export default async function handle(req, res) {
  const answerId = parseInt(req.query.answerId);
  const { answer } = req.body;
  switch (req.method) {
      
    case 'PUT':
        return updateAnswer();
    case 'DELETE':
        return deleteAnswer();
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    
    function updateAnswer() { 
         prisma.userQuestionAnswers.update({
            where: {
                id: answerId
            },
            data: { videoData: get(answer, 'videoData', {}) 
        }
        }).then(answer => {
                if (!answer) {
                    return res.status(404).end();
                }
                return res.json(answer);
            }
        ).catch(err => {
            console.error(err);
            return res.status(500).end();
        });
    }
    function deleteAnswer() {
        prisma.userQuestionAnswers.delete({
            where: {
                id: answerId
            }}).then(answer => {
                if (!answer) {
                    return res.status(404).end();
                }
                return res.json(answer);
            }).catch(err => {   
                console.error(err);
                return res.status(500).end();
            })
    }
}