import { Component } from 'react';
import { Route } from 'react-router-dom';

class TitledRoute extends Component {
    componentDidMount() {
        const { title } = this.props;
        document.title  = title ? `${title} | GWScouter` : 'GWScouter'
    }

    componentDidUpdate() {
        const { title } = this.props;
        document.title  = title ? `${title} | GWScouter` : 'GWScouter'
    }

    render() {
        const { title, ...rest } = this.props;
        return <Route {...rest} />
    }
}

export default TitledRoute;