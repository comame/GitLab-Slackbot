const [ token, botToken, gitLabUrl, port ] = [
    process.env["GAL_TOKEN"],
    process.env["GAL_BOT_TOKEN"],
    process.env["GAL_GITLAB_URL"],
    process.env.PORT
]

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = new express()

app.use(bodyParser.json())

app.post('/gal', (req, res) => {
    if (req.body.token != token) {
        console.warn('Invalid request!!!!')
        return
    }
    
    if (req.body.challenge) {
        res.status(200).send('' + req.body.challenge)
        return
    }

    const message = req.body.event.text
    const channel = req.body.event.channel
    const responseMessage = f(message)

    if (responseMessage == null) {
        res.send('ok')
        return
    }

    request.post({
        uri: 'https://slack.com/api/chat.postMessage',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + botToken
        },
        method: 'POST',
        json: true,
        body: {
            text: responseMessage,
            channel: channel
        }
    }, (error) => {
        if (error) console.warn(error)
        res.send('ok')
        return
    })
})

function f(message) {
    const matches = message.match(/(\!\d+)|(\#\d+)/g)
    const results = []
    if (matches == null) {
        return null
    }
    for (let match of matches) {
        if (match.startsWith('!')) {
            results += '<' + gitLabUrl + '/merge_requests/' + match.slice(1) + '> '
        } else {
            results += '<' + gitLabUrl + '/issues/' + match.slice(1) + '>'
        }
    }
    return results
}

app.listen(port || 3000)