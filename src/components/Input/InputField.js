import React from 'react';
import {  TextField } from '@material-ui/core';
import {  withStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: '#37aba1',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#37aba1',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#37aba1',
        },
        '&:hover fieldset': {
          borderColor: '#37aba1',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#37aba1',
        },
      },
    },
  })(TextField);


class InputField extends React.Component{

    constructor(props){
        super(props)
    }

    onChange = (e) => {
        this.props.onChange({
            type : this.props.type,
            value : e.target.value
        })
    }

    render = () => {
        return ( 
        <CssTextField {...this.props} 
            onChange={(e) => this.onChange(e)}
            startAdornment={this.props.startAdornment}
            style={{width : '80%', height : 60, marginTop : 20}} 
            placeholder={this.props.placeholder} 
            className={this.props.className} 
            id={this.props.id} 
            value={this.props.value}
            defaultValue={this.props.defaultValue}
            label={this.props.label} />
        )
    }

}


export default InputField;