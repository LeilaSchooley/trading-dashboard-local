import _ from 'lodash';
import time from 'luxon';

// Optimize by choosing a seed to generate random numbers
const randomID = () => {
    const start = _.padEnd('1', 7, '0');
    const end = _.padEnd('1', 7, '9')
    return _.random(start, end, false);
}

const timestamp = () => {
    const datetime = time.DateTime;
    const currentTime = datetime.now().toISO();
    return currentTime;
}

const convertToBST = () => {
    const datetime = time.DateTime;
    const britishTime = datetime.fromISO(currentTime)
    .setZone('Europe/London');
    return britishTime;
}


const convertToFileFormat = (json) => {
    




}


const stringBuilder = () => {
    




}
