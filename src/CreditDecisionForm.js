import './CreditDecisionForm.css';
import React from 'react';
import CreditDecisionResults from './CreditDecisionResults';

export default class CreditDecisionForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ssn: '',
      amount: 2000,
      period: 12,
      isLoaded: false,
      decisionForRequestedPeriod: null,
      decisionWithMinPeriod: null,
      error: null,
      validationMessages: []
    };

    this.submitApplication = this.submitApplication.bind(this);
  }

  submitApplication(){
    const isValid = this.validate();
    if(!isValid){
      return;
    }
    this.requestLoan(this.state.ssn, this.state.amount, this.state.period)
  }

  validate(){
    let isValid = true;
    if(!this.state.ssn) {
      isValid = false;
      alert("Social Security Number cannot be empty!");
    }
    if(this.state.amount < 2000) {
      isValid = false;
      alert("Minimum request amount is 2000€!")
    }
    return isValid;
  }


  requestLoan(ssn, amount, period) {
    this.setState({isLoaded: false })
    const apiEndPoint = 'http://localhost:8080';
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
    fetch(apiEndPoint + '/credit-decision', requestOptions)
        .then(resp => resp.json())
        .then(data => {
            this.setState({
              decisionForRequestedPeriod: data.creditDecisionForRequestedPeriod,
              decisionWithMinPeriod: data.approvedCreditDecisionWithMinPeriod,
              validationMessages: data.validationMessages,
              isLoaded: true
            }); 
        })
        .catch(error => {
          console.log(error);
          this.setState({
            error: error,
            isLoaded: true
          })
      });
  }


  updateSsn(e) {
    this.setSsn(e.target.value)
  }

  setSsn(ssn) {
    this.setState({
      ssn: ssn,
      isLoaded: false
    });
  }

  updateAmount(e) {
    this.setState({
      amount: parseInt(e.target.value),
      isLoaded: false
    });
  }

  updatePeriod(e) {
    this.setState({
      period: parseInt(e.target.value),
      isLoaded: false
    });
  }

  getSsnShortcuts(){
    const ssns = [ 
      {ssn: '49002010965', desc: 'debt' }, 
      {ssn: '49002010976', desc: 'credit modifier: 100' }, 
      {ssn: '49002010987', desc: 'credit modifier: 300' }, 
      {ssn: '49002010998', desc: 'credit modifier: 1000' } 
    ];

    return ssns.map((ssn) => <li key={ssn.ssn} className="ssn-shortcut" onClick={e => this.setSsn(ssn.ssn)}>{ssn.ssn} ({ssn.desc})</li>)
  }

  getPeriodOptionItems(){
    let periodItems = [];

    for(var i = 12; i <= 60; i++) {
      periodItems.push({label: i, value: i});
    }
    return periodItems.map((item) =>
        <option key={item.value} value={item.value}>{item.label}</option>
    );
  }

  render(){
    const ssns = this.getSsnShortcuts();
    const periodOptionItems = this.getPeriodOptionItems();

    const requestedDecision = this.state.decisionForRequestedPeriod;
    const approvedDecisionMinPeriod = this.state.decisionWithMinPeriod;
    const validationMessages = this.state.validationMessages;
    const error = this.state.error;

    return (
      <div className="app">

        <div className="welcome">
          <h2>Credit Decision Application</h2>
          <p>Welcome to Martin Aarne's test assignment for Inbank. In this fine form, you can enter a Social Security Number, loan amount and the period for repaying the loan. Once you submit your request, the application will crunch some numbers and tell you if you qualify for a loan!</p>
          <p>There are a few rules that you should be acquainted with before you start your request:</p>
          <ul>
            <li>The smallest amount that you can request is 2000€.</li>
            <li>
              The smallest amount that will be approved by the system is also 2000€.
              <ul>
                <li>This means that if you would only qualify for a loan below 2000€, it will not be approved by the system.</li>
              </ul>
            </li>
            <li>The largest amount that you can request is 10000€</li>
            <li>The largest amount that can be approved by the system is also 10000€</li>
            <li>You can request for the loan to be paid back in a period between 12 - 60 months</li>
          </ul>
          <p>Good luck!</p>
        </div>

        <div className="ssn-shortcuts">
          SSN shortcuts:
          <ul>
            {ssns}
          </ul>
        </div>
        <div className="form">
          <label htmlFor="ssn" className="label-ssn">Social Security Number:</label>
          <input type="text" autoFocus className="field field-ssn" id="ssn" value={this.state.ssn} onChange={e => this.updateSsn(e)}/>

          <br/>

          <label htmlFor="amount" className="label-amount">Loan amount (in €):</label>
          <input type="number" className="field field-amount" id="amount" value={this.state.amount} onChange={e => this.updateAmount(e)}/>

          <br/>

          <label htmlFor="period" className="label-period">Loan period (months):</label>
          <select id="period" className="field field-period" value={this.state.period} onChange={e => this.updatePeriod(e)}>
            {periodOptionItems}
          </select>

          <br/>

          <input type="submit" className="button" value="Apply now!" onClick={this.submitApplication}  />
        </div>
        
        <CreditDecisionResults 
            isLoaded={this.state.isLoaded} 
            requestedPeriod={this.state.period}
            requestedAmount={this.state.amount}
            requestedDecision={requestedDecision}
            approvedDecisionMinPeriod={approvedDecisionMinPeriod}
            error={error}
            validationMessages={validationMessages} />

      </div>
    );
  }
}