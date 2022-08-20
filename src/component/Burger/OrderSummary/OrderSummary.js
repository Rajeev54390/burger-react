import React, { Component } from 'react';
import Aux from '../../../hoc/Auxillary/Auxillary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component{
    componentWillUpdate (){
        console.log('[OrderSummary] WillUpdate');
    }
    render(){
        const ingredientSummary=Object.keys(this.props.ingredients)
        .map(igKey =>{
            return(
                <li key={igKey}>
                    <span style={{textTransform:'capitalize'}}>{igKey}</span>:{this.props.ingredients[igKey]}
                </li>
            );
        });
        return (
            <Aux>
            <h3>Your Order</h3>
            <p>Burger with following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total price : {this.props.price.toFixed(2)}</strong> </p>
            <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinue}>CONTINUE</Button>
        </Aux>
        )
    }
}

export default OrderSummary ;