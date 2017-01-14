import React, {Component} from 'react';
import {connect} from 'react-redux';

import View from './view';
import {getFilms} from '../../actions/films/get-films';

@connect(store => {
    return {
      films: store.films.films
    };
  },
  dispatch => {
    return {
      getFilmsAction: () => {
        return dispatch(getFilms());
      }
    }
  })
class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentWillMount() {
    return this.props.getFilmsAction()
      .then(() => {
        this.setState({loaded: true});
      });
  }
  render() {
    if (!this.state.loaded) {
      return null;
    }
    return <View
      films={this.props.films}
    />
  }
}

export default Container;
