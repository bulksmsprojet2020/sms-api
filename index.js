const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const smpp = require('smpp');

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = 4500;
var session = smpp.connect({
	url: 'smpp://41.219.0.38:5019',
	auto_enquire_link_period: 10000  // node app schema message mongoose findByState('waiting') ==> call SMS API (smsTo, smsFrom, smsText)
});
app.post('/sms/send', (req, res) => {
  console.log(req.body);
   // smpp client

   session.bind_transceiver({
	system_id: 'NBNotif',
	password: 'NBNot#1'
}, function(pdu) {
	if (pdu.command_status == 0) {
        // Successfully bound
		console.log('bind ...')
		console.log(pdu)
		session.submit_sm({
			destination_addr_ton:1,
			destination_addr_npi:1,
			source_addr_ton:05,
			source_addr_npi:4,
			// destination_addr: req.body.to,
			// source_addr: req.body.from,
			// short_message: req.body.message,
			destination_addr: '221775949475',
			source_addr: 'PTB',
			short_message: 'Bonjour Daouda de la part de Petit Train de Banlieu',
		}, function(pdu) {
            console.log(pdu.command_status)
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log(pdu);
			}else {
                console.log(pdu)
            }
		});
		session.deliver_sm({

		}, )
	}
});

session.on('connect', () => {
    console.log('connected...')
});

session.on('close', () => {
    console.log('closed...');
});

session.on('error', () => {
    console.log('error encoured...');
});

  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

 
})