const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const smpp = require('smpp');

//Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port = 4501; 
var isConnected = false;
var session = smpp.connect({
	url: 'smpp://41.219.0.38:5019',
	auto_enquire_link_period: 10000  // node app schema message mongoose findByState('waiting') ==> call SMS API (smsTo, smsFrom, smsText)
});
// app.post('/sms/send', (req, res) => {


  
// })

app.listen(port, () => {

   // smpp client
   var arr = [
        {id:1, from:"PTB", to:"221701001672", text:"Bonjour Diallo"},
        {id:2, from:"PTB", to:"221773085052", text:"Bonjour Abdou"},
        {id:3, from:"PTB", to:"221773439133", text:"Bonjour Thierno"},
    ]; 
    //console.log(arr)

    getConnect_smpp('bulk', arr) 
  
    console.log(`Example app listening at http://localhost:${port}`);

 
})



const sendSms = async (from, to, text) => {
    session.submit_sm({
        destination_addr_ton:1,
        destination_addr_npi:1,
        source_addr_ton:05,
        source_addr_npi:4,

        destination_addr: to,
        source_addr: from,
        message_payload: text,
    }, function(pdu) {
        //console.log(pdu.command_status)
        if (pdu.command_status == 0) {
            // Message successfully sent
            console.log(pdu);
            //return pdu;
        }
        else{
            console.log(pdu);
        }
        
    });
}

const sendSmsBulk = async (arr = [{id, from, to, text}]) => {
    var resuts = [];
  
    arr.forEach(ar => {
        const pdu = sendSms(ar.from, ar.to, ar.text);
        //resuts.push({pdu, arr});
        //console.log(pdu);
    });

    return resuts;
} 

const getConnect_smpp = (sendType, arr) => {
    session.bind_transceiver({
        system_id: 'NBNotif',
        password: 'NBNot#1'
    }, function(pdu) {
        if (pdu.command_status == 0) {
            // Successfully bound
            isConnected = true;
            //console.log(pdu)
            switch (sendType) {
                case 'one':
                    const pdu_res = sendSms(from,to,text);
                    break;
                case 'bulk':
                    const pdu_res_bulk = sendSmsBulk(arr)
                    break;    
            
                default:
                    console.log('Ce type d\'envoi n\'est pas autorisé !')
                    break;
            }
            
        }
    });
}