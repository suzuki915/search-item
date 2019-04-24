import React from 'react';
import ReactDOM from 'react-dom';

import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './index.css';

class Items extends React.Component {
  handleClick(item) {
    const code = item.substring(0, item.indexOf(' '));
    navigator.clipboard.writeText(code);
  }

  render() {
    return(
      <List>
        {
          this.props.items.map((item, i) => {
            return (
              <ListItem divider={false} button onClick={this.handleClick.bind(this, item)} key={i}>
                <ListItemText primary={item}/>
              </ListItem>
            )
          })
        }
      </List>
    )
  }
}

class SearchItem extends React.Component {
  filterList(event) {
    const updatedList = this.props.initialItems.filter((item) => {
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.props.handle(updatedList);
  }

  render() {
    return (
      <TextField
        label="Search item"
        type="search"
        margin="normal"
        variant="outlined"
        disabled={!this.props.loaded}
        onChange={this.filterList.bind(this)}
      />
    )
  }
}

class FileRead extends React.Component {
  handleChange = async (event) => {
    if (!this.file.files || !this.file.files[0]) {
      return;
    }
    const csv = await readFileAsText(this.file.files[0]);
    const arr = mapCSVToArray(csv);
    this.props.handle(arr);
  };

  render() {
    return (
      <Input
        type="file"
        inputRef={(file) => (this.file = file)}
        // accept="text/csv"
        accept="text/plain"
        onChange={this.handleChange}
      />
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialItems: null,
      items: [],
      loaded: false
    };
    this.handleFileRead = this.handleFileRead.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleFileRead(items) {
    this.setState({
      initialItems: items,
      items: items,
      loaded: true
    });
  }

  handleInputChange(updatedList) {
    this.setState({
      items: updatedList
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <FileRead handle={this.handleFileRead}/>
        </div>
        <div>
          <SearchItem initialItems={this.state.initialItems} loaded={this.state.loaded} handle={this.handleInputChange}/>
        </div>
        <div>
          <Items items={this.state.items}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve((reader.result) || '');
    reader.readAsText(file);
  });
}

function mapCSVToArray(csv) {
  // return csv.split('\n').map((row) => row.split(','));
  return csv.split(',');
}