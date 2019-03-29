const fetch = require('node-fetch')

module.exports = (req, res) => {
  fetch('https://api.artsy.net/api/v1/sales?published=true&size=100&sort=-timely_at,name',
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-XAPP-TOKEN": process.env.GRAVITY_TOKEN
      },
    })
  .then(res => res.json())
  .then(response => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    // Create response object and send result back to Slack
    const attachments = response.map(auc => {
      return {
        color: "#6E1FFF",
        title: auc.name,
        fields: [
          {
            title: "Start Date",
            value: auc.start_at,
            short: true
          }
        ]
      }
    })
    res.end(JSON.stringify({ response_type: 'in_channel', text: "Current Upcoming Auctions", attachments }))
  }).catch( error => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error }))
  })
}
