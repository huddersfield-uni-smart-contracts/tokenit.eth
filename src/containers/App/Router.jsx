import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainWrapper from './MainWrapper';
import MainRoute from './MainRoute';
import ProfilePickerPage from '../../pages/ProfilePickerPage';

const Router = () => (
	<MainWrapper>
		<main>
		<Switch>
            <Route exact path={'/'} component={ProfilePickerPage}/>	
			<Route path="/" component={MainRoute} />
		</Switch>
		</main>
	</MainWrapper>
);


export default Router;
