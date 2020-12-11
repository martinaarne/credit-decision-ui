import React from 'react';

export default class ApiService extends React.Component {
    getApiEndPoint(){
        return 'http://localhost:8080';
    }
    
    static getInstance() {  
        return new ApiService();
    }

    requestLoan(ssn, amount, period) {
        this.setState({isLoaded: false })
        const requestBody = { 
            "ssn": ssn,
            "creditAmount": amount,
            "periodInMonths": period
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        };
        var endpoint = this.getApiEndPoint();
        const response = fetch(endpoint + '/credit-decision', requestOptions)
            .then(resp => resp.json())
        return response;
    }
}