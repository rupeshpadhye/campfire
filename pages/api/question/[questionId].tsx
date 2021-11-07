import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const questionId = parseInt(req.query.questionId);
  const { question } = req.body;
  switch (req.method) {
    case 'GET':
        return getQuestionById();
    case 'PUT':
        return updateQuestion();
    case 'DELETE':
        return deleteQuestion();
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getQuestionById() {
        prisma.question.findUnique({
            where: {
                id: questionId
            }
        }).then(question => {
            if (!question) {
                return res.status(404).end();
            }
            return res.json(question);
        }).catch(err => {
            console.error(err);
            return res.status(500).end();
        });
        }
    
    function updateQuestion() { 
         prisma.question.update({
            where: {
                id: questionId
            },
            data: question}).then(question => {
                if (!question) {
                    return res.status(404).end();
                }
                return res.json(question);
            }
        ).catch(err => {
            console.error(err);
            return res.status(500).end();
        });
    }
    function deleteQuestion() {
        prisma.question.delete({
            where: {
                id: questionId
            }}).then(question => {
                if (!question) {
                    return res.status(404).end();
                }
                return res.json(question);
            }).catch(err => {   
                console.error(err);
                return res.status(500).end();
            })
    }
}