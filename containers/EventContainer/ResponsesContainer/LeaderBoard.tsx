import React from 'react';
import ResponsesContainer from '.';
import get from 'lodash/get';

const LeaderBoard = ({ event }) => {
    return <ResponsesContainer eventId={get(event,'id')}/>
}


export default LeaderBoard;