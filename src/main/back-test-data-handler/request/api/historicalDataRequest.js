import { sendRequest } from './handler/HubConnectionHandler';

const ticks = [];

const parse = () => {

    // e.g. tuesday 9th 2021 - monday 10th 2023

    for(let pointer = 0; pointer < 2; pointer++)
    {
        ticks.push(pointer);
    }

    ticks.forEach((tick) => {
        const createRequest = tick; // in json format
        sendRequest(createRequest);
    });

}