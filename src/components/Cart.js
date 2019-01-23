import React from 'react'
import CartCard from './CartCard'
import { Link } from 'react-router-dom'
import { Card, Image } from "semantic-ui-react";

class Cart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bigCart: [],
      total: 0,
    }
  }

  componentDidMount(){
    let token = localStorage.getItem('token')
    fetch('http://localhost:3005/cart_items', {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data)
      this.setState({
        bigCart: data,
        total: this.totalPrice(data),

      })
    })
  }
  totalPrice = (cartData) => {
    let tot = 0
    console.log(cartData)
    console.log(this.props.currentUser)
    console.log(this.props.cart);
    // debugger
    let filt = cartData.filter((i)=> i.cart.id === this.props.currentUser.cart.id)
    filt.forEach((k)=> tot += (k.item.price * k.amount))
    return tot
  }

  updateTotal = (amount) => {
    console.log(this.hopa())
    this.setState({
      total: this.hopa()
    })
  }


  hopa = () => {
    // console.log(this.props.cart)
    let jj = 0
    let filt = this.props.cart.filter((i)=> i.cart.id === this.props.currentUser.cart.id)
    filt.forEach((c)=> jj += ((c.amount) * c.item.price))
    return jj
  }


  deduct = (value) => {

    this.setState({
      total: this.state.total  - value
    })
  }

  checkOut = () => {
    let token = localStorage.getItem('token')
    let id = this.props.currentUser.cart.id
    fetch(`http://localhost:3005/carts/${id}/checkout`, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    }).then(()=> {
      this.setState({
        total: 0
      })
      this.props.removeCartCard()
    })
  }

  render () {

    return(
      <div>
        <Link to={'/items'}>
          <button className="ui button"> Continue Shopping </button>

        </Link>


          <button onClick={this.checkOut}className="ui button"> Check Out </button>


        <Card>
          <Image src={this.props.currentUser.img} />
          <Card.Content>
            <Card.Header>{this.props.currentUser.name}</Card.Header>

            <Card.Description>{this.props.currentUser.email}</Card.Description>
          </Card.Content>
        </Card>
        {this.props.cart.map((car, idx) => <CartCard updateTotal={this.updateTotal}
        removeClick={this.props.removeClick} currentUser={this.props.currentUser}deduct={this.deduct} car={car} changeCart={this.props.changeCart} key={idx}/> )}
        <p>TOTAL PRICE = {this.state.total}</p>
      </div>
    )
  }
}

export default Cart;
