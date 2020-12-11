import React from 'react';

export default class CreditDecisionResults extends React.Component {
    render() {
        const isLoaded = this.props.isLoaded;

        if(!isLoaded){
            return null;
        }
        const requestedPeriod = this.props.requestedPeriod
        const requestedAmount = this.props.requestedAmount;

        const requestedDecision = this.props.requestedDecision;
        const approvedDecisionMinPeriod = this.props.approvedDecisionMinPeriod;
        const error = this.props.error;
        const validationMessages = this.props.validationMessages;

        const isRejected = !requestedDecision && !approvedDecisionMinPeriod && !error && (!validationMessages || !validationMessages.length);
        const isRequestApproved = requestedDecision && requestedDecision.amount >= requestedAmount && requestedDecision.periodInMonths <= requestedPeriod;
        const isRequestApprovedForMore = isRequestApproved && requestedDecision.amount > requestedAmount;
        const isRequestApprovedForLessThanRequested = requestedDecision && requestedDecision.amount < requestedAmount;


        return(
            <div>
                    {isRejected && <p className="sorry">Sorry, you are not eligible for a loan right now.</p>}
                    {isRequestApproved && <p className="congrats">Congratulations! Your request would be approved for {requestedAmount}€ in {requestedPeriod} months.</p>}
                    {isRequestApprovedForMore && <p className="congrats">If you wish, you could even lend as much as {requestedDecision.amount}€ with a period of {requestedDecision.periodInMonths} months!</p>}
                    {isRequestApprovedForLessThanRequested && <p className="maybe">A loan would be approved, but not for the amounts that you requested. A request would be approved for {requestedDecision.amount}€ in {requestedDecision.periodInMonths} months.</p>}
                    {approvedDecisionMinPeriod && <p className="maybe">Your loan request of {requestedAmount}€ for {requestedPeriod} months was not approved, but you do apply for a loan of {approvedDecisionMinPeriod.amount}€ with a period of {approvedDecisionMinPeriod.periodInMonths} months.</p>}
                    {error && <p className="error">There was an error processing your request. Error details: {error}</p>}
                    {validationMessages && validationMessages.length > 0 && <p className="error">There were some issues validating your request. Details: {validationMessages.join(' ')}</p>}
            </div>
        );
    }
}