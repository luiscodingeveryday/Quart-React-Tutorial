import React, { Component } from 'react';
import './App.css';
import Items from './Items';
import CreateItem from './components/CreateItem';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {items: []};
  }

  async componentDidMount() {
    try {
      const response = await fetch("/items/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const items = JSON.parse(text);
      this.setState({items: items});
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async onCreate(item) {
    this.setState(prevState => ({
      items: [...prevState.items, item]
    }));

    try {
      const response = await fetch("/items/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error("Error creating item:", error);
      // Revertir el estado si hay error
      this.setState(prevState => ({
        items: prevState.items.filter(i => i !== item)
      }));
    }
  }

  render() {
    return (
      <div className="App">
        <Items items={this.state.items} />
        <CreateItem onCreate={this.onCreate.bind(this)} />
      </div>
    );
  }
}

export default App;