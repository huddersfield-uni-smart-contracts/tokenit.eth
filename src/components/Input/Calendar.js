import React from 'react';
import TextField from '@material-ui/core/TextField';

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return year + '-' + month + '-' + day;
  }

class CalendarInputField extends React.Component {
    constructor(props){
        super(props)
    }

    onChange = e => {
        this.props.onChange({
            type : this.props.type,
            value : new Date(e.target.value)
        })
    }

    render = () => {
        var def;
        if(this.props.value){
            let date = new Date(this.props.value)
            def = getFormattedDate(date)
        }
        return (
                <TextField
                    disabled={this.props.disabled}
                    onChange={(e) => this.onChange(e)}
                    id={this.props.id}
                    defaultValue={def}
                    label={this.props.label}
                    style={{paddingTop : 20}}
                    type="date"
                    className={this.props.className}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
        )
    }
}


export default CalendarInputField;