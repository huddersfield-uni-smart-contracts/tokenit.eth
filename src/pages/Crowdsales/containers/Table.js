

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { FilterListIcon } from 'mdi-react';
import Numbers from '../../../services/numbers';
import crowdsaleStatus from './codes';
import StringWorkerSingleton from '../../../services/string';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import APISingleton from '../../../controllers/API';
let counter = 0;


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


const fromDatabasetoTable = (data) => {
	return data.map( (item, index) => {
        return {
            id :  index,
            name : item.crowdsale_name,
            crowdsale_address : item.crowdsale_address,
			company : item.company ? item.company.name : 'N/A',
            investor: item.investor.name,
            investments : item.investments,
            token_price : item.token_price,
            token_amount : item.token_amount,
            raised_percentage :  Numbers.toFloat(item.already_raised/item.total_raise)*100,
            raised_amount :  Numbers.toFloat(item.already_raised),
            state: item.state || 'none'
		}
	})
}

const rows = [
    {
        id: 'id',
        label: 'Id',
        numeric: false
    },
    {
        id: 'name',
        label: 'Name',
        numeric: false
    },
    {
        id: 'investments',
        label: 'Investments',
        numeric: true
    },
    {
        id: 'crowdsale_address',
        label: 'Crowdsale Address',
        numeric: false
    },
    {
        id: 'token_price',
        label: '($) Token Price',
        numeric: true,
        align : 'left'
    },
    {
        id: 'raised_percentage',
        label: '(%) Already Raised',
        numeric: true,
        align : 'left'
    },
   
    {
        id: 'raised_amount',
        label: '($) Already Raised',
        numeric: true,
        align : 'left'
    },
    {
        id: 'state',
        label: 'State',
        numeric: false
    },
    {
        id: 'company',
        label: 'Company Name',
        numeric: false
    }
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                {rows.map(
                    row => (
                    <TableCell
                        key={row.id}
                        align={!row.align ? row.numeric ? 'right' : 'left' : row.align}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <Tooltip
                        title="Sort"
                        placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                        >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={this.createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                    ),
                    this,
                )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

    return (
        <Toolbar
        className={classNames(classes.root, {
            [classes.highlight]: numSelected > 0,
        })}
        >
        <div className={classes.title}>
            {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
                {numSelected} selected
            </Typography>
            ) : (
            <Typography variant="h6" id="tableTitle">
                Crowdsales
            </Typography>
            )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
            {numSelected > 0 ? (
            <Tooltip title="Delete">
                <IconButton aria-label="Delete">
                </IconButton>
            </Tooltip>
            ) : (
            <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                <FilterListIcon />
                </IconButton>
            </Tooltip>
            )}
        </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const defaultProps = {
 
}


class CrowdsalesTable extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            order: 'asc',
            orderBy: 'id',
            selected: [],
            data : [],
            page: 0,
            rowsPerPage: 5,
            ...defaultProps
        };
    }


    componentDidMount(){
        this.projectData(this.props)
    }

    projectData = (props) => {
        let data = props.crowdsales;
        this.setState({...this.state, 
            data : fromDatabasetoTable(data),
        })
    }


    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
        this.setState(state => ({ selected: state.data.map(n => n.id) }));
        return;
        }
        this.setState({ selected: [] });
    };

    goToEdit =  async (crowdsale) => {
        const { profile } = this.props;
        profile.setEditingCrowdsale(crowdsale);
        await profile.update();
        this.props.history.push(`/${profile.getType()}/editCrowdsale`);
    }

    handleClick = (event, object) => {
        let id = object.id;
        let crowdsale = APISingleton.getCrowdsaleByCrowdsaleAddress(object.crowdsale_address);
        this.goToEdit(crowdsale);
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                        <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                    <TableBody>
                        {stableSort(data, getSorting(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(n => {
                            const isSelected = this.isSelected(n.id);
                            return (
                                <TableRow
                                    hover
                                    onClick={event => this.handleClick(event, n)}
                                    role="checkbox"
                                    style={{padding : 0}}
                                    aria-checked={isSelected}
                                    tabIndex={-1}
                                    key={n.id}
                                    selected={isSelected}
                                >
                                    <TableCell align="left">{n.id}</TableCell>
                                    <TableCell align="left">{n.name}</TableCell>
                                    <TableCell align="center">{n.investments.length}</TableCell>
                                    <TableCell align="left">{StringWorkerSingleton.toAddressConcat(n.crowdsale_address)}</TableCell>
                                    <TableCell align="left">${n.token_price} </TableCell>
                                    <TableCell align="left">{n.raised_percentage}%</TableCell>
                                    <TableCell align="left">${n.raised_amount} </TableCell>
                                    <TableCell style={{width : 50}} align="center">
                                        <p className={crowdsaleStatus[n.state.toLowerCase()]}>
                                        {titleCase(n.state)}</p></TableCell>
                                    <TableCell align="left">{n.company}</TableCell>
                                    </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

CrowdsalesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default compose(
    withStyles(styles),
    connect(mapStateToProps)
)(CrowdsalesTable);

