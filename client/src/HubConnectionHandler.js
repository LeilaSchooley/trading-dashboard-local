import * as signalR from '@microsoft/signalr';
//import * as requestReceived from '../buffer';

export const connect = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44362/stockfeed")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();


connect.onclose(() => {
    console.log('closed ');
});

export async function start() {
    try {
        await connect.start().then(() => {
            receiveRequest()
        });
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

export const sendRequest = async (request) => {
    setTimeout(() => {
        invoke(request); // request to be sent from another class
    }, 100);
}


const onClose = () => {
    connect.onclose(() => {
        // Update state: reconnected
        console.log("reconnected close")
    });
}


const onReconnecting = () => {
    connect.onreconnected(() => {
        // Update state: reconnected
        console.log("reconnected ok")

    });
    console.log()
}

const invoke = (request) => {
    connect.invoke('sendRequest', (request));
}

const receiveRequest = () => {
    connect.on("requestData", (key, data) =>
     console.log(''));
}

setTimeout(() => {

    connect.stop();

}, 10000);

onClose();


