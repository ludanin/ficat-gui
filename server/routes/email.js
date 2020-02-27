const { readFileSync } = require('fs')
const { resolve } = require('path')
const mailer = require('../emailConfig')
const { formatDate } = require('../util/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function send(ctx) {
  const { body, files } = ctx.request
  const { uploads } = files

  // uploads pode ser um File[] ou File
  try {
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RCV_ADDRESS,
      subject: `Chamado FICAT ${body.name} - ${formatDate()}`,
      html: makeEmailContent(body),
      ...(uploads && {
        attachments: Array.isArray(uploads)
          ? uploads.map(file => ({
              filename: file.name,
              content: file
            }))
          : uploads
      })
    })
    ctx.status = 200
  } catch (e) {
    ctx.throw(HttpCodes.INT_SRV_ERROR, {
      code: MessageCodes.error.errOnEmailSend,
      message: e.message
    })
  }
}

function makeEmailContent({ name, email, fone, msg }) {
  const emailContent = readFileSync(
    resolve(__dirname, '../models/email/email.html'),
    'utf8'
  )
  return emailContent
    .replace('{{name}}', name)
    .replace('{{email}}', email)
    .replace('{{fone}}', fone)
    .replace('{{msg}}', msg)
}

module.exports = { send }
