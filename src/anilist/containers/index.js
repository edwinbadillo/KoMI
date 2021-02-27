import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import Anilist from '../components';

const mapStateToProps = (state) =>{
  return {
    ...state,
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Anilist);