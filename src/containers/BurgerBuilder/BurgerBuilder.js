import React, { Component } from 'react';

import axios from '../../axios-orders';
import Aux from '../../hoc/Auxillary/Auxillary';
import BuildControls from '../../component/Burger/BuildControls/BuildControls';
import Modal from '../../component/UI/Modal/Modal';
import OrderSummary from '../../component/Burger/OrderSummary/OrderSummary';
import Burger from '../../component/Burger/Burger';
import Spinner from '../../component/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENTS_PRICES ={
    salad:5,
    cheese:20,
    meat:25.50,
    bacon:8
}

class BurgerBuilder extends Component{
    state={
        ingredients:null,
        totalPrice : 10,
        buy:false,
        purchasing:false,
        loading : false,
        error : false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-a1ad9-default-rtdb.firebaseio.com/ingredients.json')
        .then(response =>{
            this.setState({ingredients:response.data})
        })
        .catch(error =>{
            this.setState({error : true})
        })
    }

    updateBuyState (ingredients) {
        const sum= Object.keys(ingredients)
        .map(igKey =>{
            return ingredients[igKey];
        })
        .reduce((sum, el) =>{
            return sum+el;
        }, 0);
        this.setState({buy:sum>0});
    }

    addIngredientHandler =(type) =>{
        const oldCount= this.state.ingredients[type];
        const updatedCount= oldCount+1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]= updatedCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice= oldPrice+priceAddition;
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients});
        this.updateBuyState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        const oldCount= this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedCount= oldCount-1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]= updatedCount;
        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice= oldPrice-priceDeduction;
        this.setState({totalPrice:newPrice, ingredients:updatedIngredients});
        this.updateBuyState(updatedIngredients);
    }


    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler =() =>{
        this.setState({purchasing:false});
    }


    purchaseContinueHandler=() =>{
        // alert('Continue purchasing!');
        this.setState({loading:true});
        const order ={
            ingredients : this.state.ingredients,  
            price : this.state.totalPrice,
            customer :{
                name : 'Rajeev',
                address :{
                    street : 'G.T Road',
                    zipCode : '711106',
                    country : 'India'
                },
                email: 'th9titanspidy@gmail.com'
            },
            deliveryMethod : 'superfast'
        }
        axios.post('/orders.json', order)
        .then(response =>{
            this.setState({loading:false, purchasing:false});
        })
        .catch(error => {
            this.setState({loading:false, purchasing:false});
        });
    }


    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key]<=0
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can;t be loaded</p> :<Spinner />;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    buy={this.state.buy}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
                </Aux>
            );
        orderSummary =<OrderSummary ingredients={this.state.ingredients} 
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
        price={this.state.totalPrice}/>
        }

        if(this.state.loading){
            orderSummary = <Spinner />
        }
        

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        ); 
    }
}

export default withErrorHandler(BurgerBuilder, axios);